export interface Form {
  id: number;
  title: string;
  containsGeoData: boolean;
  fieldsGeoData: { address: string; city: string; lat: string; lng: string };
  surveyJS: any;
}

export interface Event {
  id: number;
  title: string;
}

export enum NetworkTypeEnum {
  NODE = 'node',
  EDGE = 'edge',
}

export interface Domain {
  id: number;
  title: string;
  form: Form;
  networkType: NetworkTypeEnum;
}

export enum NodeShapeEnum {
  ELLIPSE = 'ellipse',
  BOX = 'box',
}

export interface NodeType {
  id: number;
  name: string;
  color: string;
  shape: NodeShapeEnum;
}

export interface Node {
  id: number;
  event: Event;
  nodeType: NodeType;
  customId: string;
  edges: Edge[];
  nodeDomains: NodeDomain[];
}

export interface NodeDomain {
  id: number;
  node: Node;
  domain: Domain;
  values: any;
}

export interface Edge {
  id: number;
  nodeFrom: number;
  nodeTo: number;
  edgeDomains: EdgeDomain[];
}

export interface EdgeDomain {
  id: number;
  edge: Edge;
  domain: Domain;
  values: any;
}
