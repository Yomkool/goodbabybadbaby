import { useEffect, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ViewToken,
  LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useFeedStore, FeedPost } from '@/stores/feedStore';
import { PostCard, FeedFilters } from '@/components/feed';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [showOverlays, setShowOverlays] = useState(true);
  const [containerHeight, setContainerHeight] = useState(0);

  const {
    posts,
    filters,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    error,
    fetchFeed,
    refreshFeed,
    loadMore,
    setFilter,
    setFeedType,
    setSpeciesFilter,
    toggleLike,
  } = useFeedStore();

  useEffect(() => {
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].item) {
        setVisiblePostId(viewableItems[0].item.id);
        setVisibleIndex(viewableItems[0].index ?? 0);
        setShowOverlays(true);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleToggleOverlay = useCallback(() => {
    setShowOverlays((prev) => !prev);
  }, []);

  const renderPostCard = useCallback(
    ({ item, index }: { item: FeedPost; index: number }) => {
      const isVisible = item.id === visiblePostId && isFocused;
      // Preload the next video for smoother scrolling
      const shouldPreload = index === visibleIndex + 1;

      return (
        <PostCard
          post={item}
          isVisible={isVisible}
          shouldPreload={shouldPreload}
          showOverlay={showOverlays}
          cardHeight={containerHeight}
          onLike={() => toggleLike(item.id)}
          onToggleOverlay={handleToggleOverlay}
        />
      );
    },
    [visiblePostId, visibleIndex, isFocused, showOverlays, containerHeight, toggleLike, handleToggleOverlay]
  );

  const keyExtractor = useCallback((item: FeedPost) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: containerHeight,
      offset: containerHeight * index,
      index,
    }),
    [containerHeight]
  );

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, loadMore]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={[styles.footer, { height: containerHeight }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }, [isLoadingMore, containerHeight]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View style={[styles.emptyContainer, { height: containerHeight }]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.emptyContainer, { height: containerHeight }]}>
          <Text style={styles.emptyEmoji}>😿</Text>
          <Text style={styles.emptyTitle}>Oops!</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.emptyContainer, { height: containerHeight }]}>
        <Text style={styles.emptyEmoji}>
          {filters.type === 'following' ? '👀' : '🐾'}
        </Text>
        <Text style={styles.emptyTitle}>
          {filters.type === 'following' ? 'No posts yet' : 'No posts yet'}
        </Text>
        <Text style={styles.emptyText}>
          {filters.type === 'following'
            ? 'Follow some pets to see their posts!'
            : 'Be the first to share your pet!'}
        </Text>
      </View>
    );
  }, [isLoading, error, containerHeight, filters.type]);

  return (
    <View style={styles.container}>
      {/* Feed container - measures available height */}
      <View style={styles.feedContainer} onLayout={handleLayout}>
        {containerHeight > 0 && (
          <FlatList
            data={posts}
            renderItem={renderPostCard}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            pagingEnabled
            disableIntervalMomentum
            snapToInterval={containerHeight}
            snapToAlignment="start"
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refreshFeed}
                tintColor="#fff"
                colors={['#fff']}
                progressBackgroundColor="#333"
              />
            }
            removeClippedSubviews
            maxToRenderPerBatch={2}
            windowSize={3}
            initialNumToRender={1}
          />
        )}
      </View>

      {/* Filter bar - positioned over content */}
      {showOverlays && (
        <View style={[styles.filterWrapper, { top: insets.top }]}>
          <FeedFilters
            feedType={filters.type}
            filter={filters.filter}
            species={filters.species}
            onFeedTypeChange={setFeedType}
            onFilterChange={setFilter}
            onSpeciesChange={setSpeciesFilter}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  feedContainer: {
    flex: 1,
  },
  filterWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
