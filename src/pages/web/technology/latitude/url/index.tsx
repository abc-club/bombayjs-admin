import React, { Component } from 'react';
// 引入组件
import OptionList from '@/components/OptionList';
import PvUv from '@/components/GraphHOC/PvUv';
import JsError from '@/components/GraphHOC/JsError';
import JsErrorCluster from '@/components/GraphHOC/JsErrorCluster';
import ApiDetail from '@/components/GraphHOC/ApiDetail';
import TerminalDistribution from './TerminalDistribution';
// 引入样式
import styles from './style.less';
// 引入服务
import { getLatitudeData } from '@/services/latitude';

class UrlContainer extends Component {
  public state = {
    listData: [],
    listTitle: '按访问量排行',
    listActiveOption: {
      isActive: false,
      name: '',
      resultNum: '',
    },
  };

  componentDidMount() {
    this.handleGetListData();
  }

  handleGetListData = async () => {
    // 获取列表数据
    const params = this.handleAssembleParams();
    const listDataResult = await getLatitudeData(params);
    if (listDataResult.code === 200) {
      const tempResult = listDataResult.data;
      const tempListData = tempResult.data.map(
        (listDataResultItem: any, listDataResultIndex: number) => ({
          isActive: listDataResultIndex === 0,
          name: listDataResultItem.page,
          resultNum: `${listDataResultItem.pv} (${(
            (listDataResultItem.pv / tempResult.total) *
            100
          ).toFixed(2)}%)`,
        }),
      );
      this.setState({
        listData: tempListData,
        listActiveOption: tempListData[0],
      });
    }
  };

  handleClickListItem = (listDataItem: any) => {
    // 设置当前列表项
    const { listData } = this.state;
    listData.forEach((listItem: any) => {
      listItem.isActive = listItem.name === listDataItem.name;
    });
    this.setState({ listActiveOption: listDataItem });
  };

  handleAssembleParams = (type?: string) => {
    // 组装不同图表的数据
    let params = {
      metric: 'webstat.url',
      measures: ['pv', 'uv'],
      dimensions: ['page'],
      filters: {},
      intervalMillis: 4 * 60 * 60 * 1000,
      startTime: new Date().getTime() - 20 * 60 * 60 * 1000,
      endTime: new Date().getTime(),
      orderBy: 'pv',
      order: 'DESC',
    };
    if (type === 'pvUv') {
      params = {
        ...params,
        ...{
          filters: {
            page: this.state.listActiveOption.name,
          },
          dimensions: [],
        },
      };
    } else if (type === 'jsError') {
      params = {
        ...params,
        ...{
          measures: ['uv', 'count'],
          filters: {
            t: 'error',
            page: this.state.listActiveOption.name,
          },
          dimensions: [],
        },
      };
    } else if (type === 'jsErrorCluster') {
      params = {
        ...params,
        ...{
          measures: ['count', 'uv'],
          filters: {
            t: 'error',
            page: this.state.listActiveOption.name,
          },
          dimensions: ['msg'],
        },
      };
    } else if (type === 'apiDetail') {
      params = {
        ...params,
        ...{
          measures: ['count', 'avg_time'],
          filters: {
            t: 'api',
            page: this.state.listActiveOption.name,
          },
          dimensions: ['url'],
        },
      };
    } else if (type === 'terminalDistribution') {
      params = {
        ...params,
        ...{
          measures: ['pv', 'uv'],
          filters: {
            t: 'pv',
            page: this.state.listActiveOption.name,
          },
          dimensions: ['detector.browser.name'],
        },
      };
    }
    return params;
  };

  render() {
    const { listData, listTitle, listActiveOption } = this.state;
    const pvUvParams = this.handleAssembleParams('pvUv');
    const jsErrorParams = this.handleAssembleParams('jsError');
    const jsErrorClusterParams = this.handleAssembleParams('jsErrorCluster');
    const apiDetailParams = this.handleAssembleParams('apiDetail');
    const terminalDistribution = this.handleAssembleParams('terminalDistribution');
    return (
      <section className={styles.geographyContainer}>
        {/* 选项列表组件 */}
        <OptionList
          listTitle={listTitle}
          listData={listData}
          handleClickListItem={this.handleClickListItem}
        />
        {/* 图表内容 */}
        <div className={styles.geographyContent}>
          {listActiveOption.name && (
            <>
              <PvUv graphParams={pvUvParams} activeOptionName={listActiveOption.name} />
              <JsError graphParams={jsErrorParams} activeOptionName={listActiveOption.name} />
              <JsErrorCluster
                graphParams={jsErrorClusterParams}
                activeOptionName={listActiveOption.name}
              />
              <ApiDetail graphParams={apiDetailParams} activeOptionName={listActiveOption.name} />
              <TerminalDistribution
                graphParams={terminalDistribution}
                activeOptionName={listActiveOption.name}
              />
            </>
          )}
        </div>
      </section>
    );
  }
}

export default UrlContainer;
