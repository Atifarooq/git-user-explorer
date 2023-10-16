import React from "react";
import { Paper } from "@mui/material";
import {
  WindowScroller,
  InfiniteLoader,
  AutoSizer,
  List as VirtualList,
} from "react-virtualized";
import ListBox from "../components/ListBox";
import PullToRefresh from "../../../components/PullToRefresh";

const withInfiniteLoader =
  (Component: React.ComponentType<any>) =>
  ({ loading, loadMore, rowLoaded, total, list, rowHeight, ...rest }: any) =>
    (
      <PullToRefresh
        onRefresh={() => loadMore({ startIndex: 0 })}
        loading={loading}
      >
        <Paper elevation={3} sx={{ p: 1 }}>
          <InfiniteLoader
            isRowLoaded={rowLoaded}
            loadMoreRows={loadMore}
            rowCount={total}
            threshold={1}
          >
            {({ onRowsRendered, registerChild }: any) => (
              <WindowScroller>
                {({ height, scrollTop }) => (
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <VirtualList
                        autoHeight
                        height={height}
                        width={width}
                        scrollTop={scrollTop}
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        rowCount={total}
                        rowHeight={rowHeight}
                        rowRenderer={({ key, index, style }) => {
                          const item = list[index] ?? null;
                          return (
                            <Component
                              {...rest}
                              index={index}
                              user={item}
                              key={key}
                              style={style}
                            />
                          );
                        }}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader>
        </Paper>
      </PullToRefresh>
    );

export default withInfiniteLoader(ListBox);
