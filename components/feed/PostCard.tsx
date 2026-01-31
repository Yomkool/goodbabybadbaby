import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Animated,
  PanResponder,
} from 'react-native';
import { Image } from 'expo-image';
import { VideoView, useVideoPlayer } from 'expo-video';
import { FontAwesome } from '@expo/vector-icons';
import type { FeedPost } from '@/stores/feedStore';
import { useVideoStore } from '@/stores/videoStore';
import { getSpeciesEmoji } from '@/lib/constants/species';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DOUBLE_TAP_DELAY = 300;
const PROGRESS_BAR_HEIGHT = 3;
const PROGRESS_BAR_HIT_SLOP = 20;

interface PostCardProps {
  post: FeedPost;
  isVisible: boolean;
  shouldPreload?: boolean;
  showOverlay: boolean;
  cardHeight: number;
  onLike: () => void;
  onToggleOverlay: () => void;
}

export function PostCard({
  post,
  isVisible,
  shouldPreload = false,
  showOverlay,
  cardHeight,
  onLike,
  onToggleOverlay,
}: PostCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const likeScale = useRef(new Animated.Value(0)).current;
  const lastTap = useRef<number>(0);
  const progressBarWidth = useRef(0);

  const { isMuted, toggleMute } = useVideoStore();

  const isVideo = post.media.type === 'video';
  const mediaUrl = post.media.cdn_url || post.media.original_url;
  const thumbnailUrl = post.media.thumbnail_url;

  // Create player for visible post or preloading post (next in feed)
  const shouldCreatePlayer = isVideo && (isVisible || shouldPreload);
  const player = useVideoPlayer(shouldCreatePlayer ? mediaUrl : null, (p) => {
    p.loop = true;
    p.muted = isMuted;
  });

  // Sync mute state with player
  useEffect(() => {
    if (player) {
      player.muted = isMuted;
    }
  }, [player, isMuted]);

  // Handle playback state
  useEffect(() => {
    if (isVideo && player) {
      if (isVisible && isPlaying && !isSeeking) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [isVideo, player, isVisible, isPlaying, isSeeking]);

  // Reset playing state when becoming visible
  useEffect(() => {
    if (isVisible) {
      setIsPlaying(true);
    }
  }, [isVisible]);

  // Track video progress and buffering
  useEffect(() => {
    if (!player || !isVideo) return;

    const statusSubscription = player.addListener('statusChange', (payload) => {
      setIsBuffering(payload.status === 'loading');
    });

    const progressInterval = setInterval(() => {
      if (player && !isSeeking) {
        setCurrentTime(player.currentTime);
        if (player.duration > 0) {
          setDuration(player.duration);
        }
      }
    }, 100);

    return () => {
      statusSubscription.remove();
      clearInterval(progressInterval);
    };
  }, [player, isVideo, isSeeking]);

  // Progress bar pan responder for seeking
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (!isVideo || !player || duration <= 0) return;
        setIsSeeking(true);
        const x = evt.nativeEvent.locationX;
        const progress = Math.max(0, Math.min(1, x / progressBarWidth.current));
        setSeekPosition(progress);
      },
      onPanResponderMove: (evt) => {
        if (!isVideo || !player || duration <= 0) return;
        const x = evt.nativeEvent.locationX;
        const progress = Math.max(0, Math.min(1, x / progressBarWidth.current));
        setSeekPosition(progress);
      },
      onPanResponderRelease: () => {
        if (!isVideo || !player || duration <= 0) return;
        const newTime = seekPosition * duration;
        player.currentTime = newTime;
        setCurrentTime(newTime);
        setIsSeeking(false);
        if (isPlaying) {
          player.play();
        }
      },
      onPanResponderTerminate: () => {
        setIsSeeking(false);
      },
    })
  ).current;

  // Animate the like heart
  const animateLike = useCallback(() => {
    setShowLikeAnimation(true);
    likeScale.setValue(0);
    Animated.sequence([
      Animated.spring(likeScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 0,
        duration: 200,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start(() => setShowLikeAnimation(false));
  }, [likeScale]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap.current;

    if (timeSinceLastTap < DOUBLE_TAP_DELAY) {
      // Double tap - like
      if (!post.isLikedByCurrentUser) {
        onLike();
        animateLike();
      }
      lastTap.current = 0;
    } else {
      // Single tap - 3 state cycle for videos:
      // State 1: overlay ON, playing → hide overlay, keep playing
      // State 2: overlay OFF, playing → pause video
      // State 3: overlay OFF, paused → show overlay, play video
      lastTap.current = now;
      setTimeout(() => {
        if (lastTap.current === now) {
          if (isVideo) {
            if (showOverlay && isPlaying) {
              // State 1 → 2: Hide overlay, keep playing
              onToggleOverlay();
            } else if (!showOverlay && isPlaying) {
              // State 2 → 3: Pause video
              setIsPlaying(false);
            } else {
              // State 3 → 1: Show overlay, play video
              onToggleOverlay();
              setIsPlaying(true);
            }
          } else {
            // For images, just toggle overlay
            onToggleOverlay();
          }
        }
      }, DOUBLE_TAP_DELAY);
    }
  }, [post.isLikedByCurrentUser, onLike, animateLike, onToggleOverlay, isVideo, showOverlay, isPlaying]);

  const handleLikePress = useCallback(() => {
    onLike();
    if (!post.isLikedByCurrentUser) {
      animateLike();
    }
  }, [onLike, post.isLikedByCurrentUser, animateLike]);

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const progress = isSeeking ? seekPosition : (duration > 0 ? currentTime / duration : 0);

  return (
    <View style={[styles.container, { height: cardHeight }]}>
      {/* Media */}
      {isVideo ? (
        <VideoView
          style={styles.media}
          player={player}
          contentFit="contain"
          nativeControls={false}
        />
      ) : (
        <Image
          source={{ uri: mediaUrl }}
          style={styles.media}
          contentFit="contain"
          onLoad={() => setImageLoading(false)}
          onError={() => { setImageLoading(false); setImageError(true); }}
          placeholder={thumbnailUrl ? { uri: thumbnailUrl } : undefined}
          transition={200}
        />
      )}

      {/* Image loading spinner */}
      {imageLoading && !isVideo && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}

      {/* Video buffering spinner */}
      {isVideo && isBuffering && isVisible && (
        <View style={styles.bufferingContainer} pointerEvents="none">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {imageError && (
        <View style={styles.error}>
          <FontAwesome name="image" size={32} color="#666" />
        </View>
      )}

      {/* Tap area */}
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.tapArea} />
      </TouchableWithoutFeedback>

      {/* Double-tap like animation */}
      {showLikeAnimation && (
        <Animated.View
          style={[
            styles.likeAnimation,
            {
              transform: [{ scale: likeScale }],
              opacity: likeScale,
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.likeAnimationEmoji}>
            {post.type === 'good' ? '😇' : '😈'}
          </Text>
        </Animated.View>
      )}

      {/* Pause indicator */}
      {isVideo && !isPlaying && !isBuffering && (
        <View style={styles.pauseIcon} pointerEvents="none">
          <FontAwesome name="play" size={36} color="rgba(255,255,255,0.8)" />
        </View>
      )}

      {/* Video progress bar */}
      {isVideo && duration > 0 && (
        <View
          style={styles.progressBarContainer}
          onLayout={(e) => { progressBarWidth.current = e.nativeEvent.layout.width; }}
          {...panResponder.panHandlers}
        >
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
          {isSeeking && (
            <View style={[styles.seekThumb, { left: `${progress * 100}%` }]} />
          )}
        </View>
      )}

      {/* Mute button for videos */}
      {isVideo && showOverlay && (
        <TouchableOpacity style={styles.muteBtn} onPress={toggleMute} activeOpacity={0.7}>
          <FontAwesome
            name={isMuted ? 'volume-off' : 'volume-up'}
            size={18}
            color="#fff"
          />
        </TouchableOpacity>
      )}

      {/* Overlay */}
      {showOverlay && (
        <View style={styles.overlayContainer} pointerEvents="box-none">
          {/* Champion */}
          {post.current_champion && (
            <View style={styles.crown}>
              <Text style={styles.crownText}>👑</Text>
            </View>
          )}

          {/* Like button - angel/devil emojis */}
          <TouchableWithoutFeedback onPress={handleLikePress}>
            <View style={styles.likeBtn}>
              <Text style={[
                styles.likeEmoji,
                !post.isLikedByCurrentUser && styles.likeEmojiInactive
              ]}>
                {post.type === 'good' ? '😇' : '😈'}
              </Text>
              <Text style={styles.likeCount}>{formatCount(post.like_count)}</Text>
            </View>
          </TouchableWithoutFeedback>

          {/* Bottom info */}
          <View style={styles.bottom}>
            <View style={styles.info}>
              {post.pet.avatar_url ? (
                <Image source={{ uri: post.pet.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarEmoji}>{getSpeciesEmoji(post.pet.species)}</Text>
                </View>
              )}
              <View style={styles.names}>
                <View style={styles.petNameRow}>
                  <View style={[styles.typePill, post.type === 'good' ? styles.goodPill : styles.badPill]}>
                    <Text style={styles.pillEmoji}>{post.type === 'good' ? '😇' : '😈'}</Text>
                    <Text style={[styles.pillText, post.type === 'good' ? styles.goodPillText : styles.badPillText]}>
                      {post.type === 'good' ? 'Good baby' : 'Bad baby'}
                    </Text>
                  </View>
                  <Text style={styles.petName} numberOfLines={1}>{post.pet.name}</Text>
                </View>
                <Text style={styles.userName} numberOfLines={1}>@{post.user.display_name}</Text>
              </View>
            </View>
            {post.tags && post.tags.length > 0 && (
              <Text style={styles.tags} numberOfLines={1}>
                {post.tags.slice(0, 3).map(t => `#${t}`).join(' ')}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: '#000',
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bufferingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  tapArea: {
    ...StyleSheet.absoluteFillObject,
  },
  likeAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
  },
  likeAnimationEmoji: {
    fontSize: 100,
  },
  pauseIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -18,
    marginLeft: -18,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: PROGRESS_BAR_HEIGHT + PROGRESS_BAR_HIT_SLOP * 2,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  progressBarTrack: {
    height: PROGRESS_BAR_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: PROGRESS_BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: PROGRESS_BAR_HEIGHT / 2,
  },
  seekThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginLeft: -6,
    top: PROGRESS_BAR_HIT_SLOP - 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  muteBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  crown: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,215,0,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  crownText: {
    fontSize: 14,
  },
  likeBtn: {
    position: 'absolute',
    right: 12,
    bottom: 80,
    alignItems: 'center',
    padding: 8,
  },
  likeEmoji: {
    fontSize: 28,
  },
  likeEmojiInactive: {
    opacity: 0.6,
  },
  likeCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottom: {
    position: 'absolute',
    bottom: 16,
    left: 12,
    right: 56,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 16,
  },
  names: {
    marginLeft: 8,
    flex: 1,
  },
  petNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  goodPill: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
  },
  badPill: {
    backgroundColor: 'rgba(239, 83, 80, 0.9)',
  },
  pillEmoji: {
    fontSize: 10,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  goodPillText: {
    color: '#8B6914',
  },
  badPillText: {
    color: '#fff',
  },
  petName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  userName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tags: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
