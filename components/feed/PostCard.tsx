import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { VideoView, useVideoPlayer } from 'expo-video';
import { FontAwesome } from '@expo/vector-icons';
import type { FeedPost } from '@/stores/feedStore';
import { getSpeciesEmoji } from '@/lib/constants/species';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DOUBLE_TAP_DELAY = 300;

interface PostCardProps {
  post: FeedPost;
  isVisible: boolean;
  showOverlay: boolean;
  cardHeight: number;
  onLike: () => void;
  onToggleOverlay: () => void;
}

export function PostCard({
  post,
  isVisible,
  showOverlay,
  cardHeight,
  onLike,
  onToggleOverlay,
}: PostCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const likeScale = useRef(new Animated.Value(0)).current;
  const lastTap = useRef<number>(0);

  const isVideo = post.media.type === 'video';
  const mediaUrl = post.media.cdn_url || post.media.original_url;
  const thumbnailUrl = post.media.thumbnail_url;

  const player = useVideoPlayer(isVideo && isVisible ? mediaUrl : null, (p) => {
    p.loop = true;
    p.muted = false;
  });

  useEffect(() => {
    if (isVideo && player) {
      if (isVisible && isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [isVideo, player, isVisible, isPlaying]);

  useEffect(() => {
    if (isVisible) {
      setIsPlaying(true);
    }
  }, [isVisible]);

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

      {imageLoading && !isVideo && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#fff" />
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
      {isVideo && !isPlaying && (
        <View style={styles.pauseIcon} pointerEvents="none">
          <FontAwesome name="play" size={36} color="rgba(255,255,255,0.8)" />
        </View>
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
