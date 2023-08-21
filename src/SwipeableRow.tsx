import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

type Props<ItemT> = {
  info: ItemT;
  renderLeftActions?: (
    info: any,
    { close }: { close: () => void },
  ) => React.ReactNode;
  renderRightActions?: (
    info: any,
    { close }: { close: () => void },
  ) => React.ReactNode;
  isScrolling: boolean;
  closeOnScroll: boolean;
  children?: React.ReactElement | null;
};

export const SwipeableRow = <ItemT extends {}>({
  info,
  renderLeftActions,
  renderRightActions,
  children,
  closeOnScroll,
  isScrolling,
}: Props<ItemT>) => {
  const rowRef = useRef<Swipeable | null>();

  const close = () => {
    if (!rowRef.current) {
      return;
    }
    rowRef.current.close();
  };

  useEffect(() => {
    if (isScrolling && closeOnScroll) {
      close();
    }
  }, [closeOnScroll, isScrolling]);
  return (
    <Swipeable
      renderLeftActions={() => {
        return renderLeftActions && renderLeftActions(info, { close });
      }}
      renderRightActions={() => {
        return renderRightActions && renderRightActions(info, { close });
      }}
      leftThreshold={40}
      rightThreshold={40}
      friction={2}
      ref={ref => (rowRef.current = ref)}
    >
      <View>{children}</View>
    </Swipeable>
  );
};
