interface IDateRangeType {
  type: string;
  begin: string;
  end: string;
}

interface IEventVariate {
  _id?: string;
  user_id?: string;
  project_token: string; // 项目id
  name: string; // 事件名称
  marker: string; // 标识符 圈选就是路径
  type: string; // 类型
  is_use?: 0 | 1; // 是否有效
}

interface IGetEventVariateListConditions {
  project_token: string;
  name?: string;
  marker?: string;
  type?: string; // 类型
  is_use?: 0 | 1;
}

interface IPageVariate {
  _id?: string;
  user_id?: string;
  project_token: string; // 项目id
  name: string; // 名称
  path: string; // 路径
  is_use?: 0 | 1; // 是否有效
}

interface IGetPageVariateListConditions {
  project_token: string;
  name?: string;
  path?: string;
  is_use?: 0 | 1;
}
