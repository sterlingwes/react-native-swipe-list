import React, { Ref, useState } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { SwipeableRow } from './SwipeableRow';

type SwipableListProps<ItemT> = {
  // Callback method to render the view that will be unveiled on swipe
  renderLeftActions?: (
    info: ListRenderItemInfo<ItemT>,
    options: { close: () => void },
  ) => React.ReactNode;
  renderRightActions?: (
    info: ListRenderItemInfo<ItemT>,
    options: { close: () => void },
  ) => React.ReactNode;
  closeOnScroll?: boolean;
};

type Props<ItemT> = SwipableListProps<ItemT> &
  FlatListProps<ItemT> & { flatListRef?: Ref<FlatList<ItemT>> };

export const SwipeableFlatList = <ItemT extends {}>(props: Props<ItemT>) => {
  const [isScrolling, setScrolling] = useState(false);

  const _onScrollBeginDrag = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ): void => {
    // Close any opens rows on ListView scroll
    if (!isScrolling) {
      setScrolling(true);
    }
    props.onScrollBeginDrag && props.onScrollBeginDrag(e);
  };

  const _onScrollEndDrag = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ): void => {
    // Close any opens rows on ListView scroll
    if (isScrolling) {
      setScrolling(false);
    }
    props.onScrollBeginDrag && props.onScrollBeginDrag(e);
  };

  const _renderItem = (
    info: ListRenderItemInfo<ItemT>,
  ): React.ReactElement | null => {
    const {
      renderRightActions = () => null,
      renderLeftActions = () => null,
      closeOnScroll = true,
    } = props;
    return (
      <SwipeableRow
        info={info}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        isScrolling={isScrolling}
        closeOnScroll={closeOnScroll}
      >
        {props.renderItem && props.renderItem(info)}
      </SwipeableRow>
    );
  };

  return (
    <FlatList
      {...props}
      ref={props.flatListRef}
      onScrollBeginDrag={_onScrollBeginDrag}
      onScrollEndDrag={_onScrollEndDrag}
      renderItem={_renderItem}
    />
  );
};
