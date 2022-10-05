import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  Edge,
  Event,
  Node,
  NodeDomain,
  NodeShapeEnum,
} from 'src/app/model/model';
import { PageRequest } from 'src/app/model/pagination';
import { DataSet } from 'vis-data/peer/esm/vis-data';
import {
  Data,
  Edge as EdgeVis,
  Network,
  Node as NodeVis,
  Options,
} from 'vis-network';
import * as GraphManagerActions from '../graph-manager.actions';
import * as GraphManagerSelectors from '../graph-manager.selectors';

@Component({
  selector: 'app-draw-graph',
  templateUrl: './draw-graph.component.html',
  styleUrls: ['./draw-graph.component.scss'],
})
export class DrawGraphComponent implements OnInit, AfterContentChecked {
  nodes: Node[] = [];
  edges: Edge[] = [];
  nodeVisDataSet: DataSet<NodeVis> | null = null;
  edgeVisDataSet: DataSet<EdgeVis> | null = null;
  eventSelected: Event | null;
  graphData: Data = {
    nodes: undefined,
    edges: undefined,
  };
  menuFiltrosExpandido = false;
  network: Network;
  nodeSelected: Node | undefined;

  newNodeAdded: boolean = false;
  addingEdgeMode: boolean = false;
  nodes$: any;
  edges$: any;
  nodeSelected$: any;

  constructor(private cdref: ChangeDetectorRef, private store: Store) {}

  ngOnInit(): void {
    this.nodeVisDataSet = null;
    this.edgeVisDataSet = null;
    this.nodes = [
      {
        id: 2,
        customId: '',
        edges: [],
        event: { id: 1, title: 'Titulo 1' },
        nodeDomains: [],
        nodeType: {
          color: 'white',
          id: 2,
          name: 'APP-1',
          shape: NodeShapeEnum.BOX,
        },
      },
      {
        id: 1,
        customId: '',
        edges: [],
        event: { id: 1, title: 'Titulo 2' },
        nodeDomains: [],
        nodeType: {
          color: 'white',
          id: 2,
          name: 'APP-2',
          shape: NodeShapeEnum.BOX,
        },
      },
    ];
    this.edges = [
      {
        id: 1,
        edgeDomains: [],
        nodeFrom: 1,
        nodeTo: 2,
      },
    ];
    this.gerarNetwork();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  selectEvent(event: Event) {
    console.log('Select');
    this.eventSelected = event;
    this.generateNetwork();
  }

  cancelEventSelected() {
    this.eventSelected = undefined!;
  }

  generateNetwork() {
    const queryAdicional = new Map();
    if (this.eventSelected) {
      queryAdicional.set('event_id', this.eventSelected.id);

      const pageRequest = new PageRequest(
        { pageNumber: 0, pageSize: 10 },
        { property: null, direction: null },
        queryAdicional
      );

      this.store.dispatch(
        GraphManagerActions.loadNodes({ queryBuilder: pageRequest })
      );
      this.store.dispatch(
        GraphManagerActions.loadEdges({ queryBuilder: pageRequest })
      );

      this.nodeSelected$ = this.store.pipe(
        select(GraphManagerSelectors.selectNodeSelected)
      );
      this.nodes$ = this.store.pipe(
        select(GraphManagerSelectors.selectAllNodes)
      );
      this.edges$ = this.store.pipe(select(GraphManagerSelectors.selectEdges));

      this.nodes$.subscribe((nodes: Node[]) => {
        if (nodes) {
          this.nodes = nodes;
          this.generateNodes();
          if (this.nodeSelected) {
            this.nodeSelected = this.nodes.find(
              (n) => n.id === this.nodeSelected?.id
            );
            this.updateSingleNodeById(this.nodeSelected);
          }
        }
      });

      this.edges$.subscribe((edges: Edge[]) => {
        if (edges && edges.length) {
          this.edges = edges;
          this.generateEdges();
          this.gerarNetwork();
        }
      });

      this.nodeSelected$.subscribe((node: Node) => {
        this.nodeSelected = node;
      });
    }
  }

  gerarNetwork() {
    this.generateNodes();
    this.generateEdges();
    if (this.nodeVisDataSet && this.edgeVisDataSet) {
      this.graphData = {
        nodes: this.nodeVisDataSet,
        edges: this.edgeVisDataSet,
      };
      const options: Options = {
        locale: 'pt-br',
        manipulation: {
          enabled: true,
          initiallyActive: false,
          addNode: (data: any, callback: any) => {
            console.log('AddNode', data);
          },
          editNode: (data: any, callback: any) => {
            console.log('editNode', data);
          },
          addEdge: (data: any, callback: any) => {
            if (data.from !== data.to) {
              this.createEdge(data);
            }
            console.log('addEdge', data);
          },
          editEdge: {
            editWithoutDrag: (data: any, callback: any) => {
              console.log('editWithoutDrag', data);
            },
          },
        },
      };
      const container = document.getElementById('mynetwork');
      if (container) {
        this.network = new Network(container, this.graphData, options);
        this.network.on('click', (properties) => {
          const nodeId = properties.nodes[0];
          this.store.dispatch(GraphManagerActions.selectNode({ nodeId }));
        });

        this.network.on('afterDrawing', () => {
          console.log('afterDrawing');
          if (this.nodeSelected) {
            this.network.selectNodes([this.nodeSelected.id], true);
          }

          if (this.newNodeAdded) {
            this.newNodeAdded = false;
            if (this.nodeSelected) {
              this.network.focus(this.nodeSelected.id);
            }
          }
        });
      }
    }
  }

  atualizarLayout(event: any) {
    if (event.checked) {
      this.network.setOptions({
        layout: {
          improvedLayout: true,
          hierarchical: {
            enabled: true,
            direction: 'LR',
            sortMethod: 'directed',
          },
        },
      });
    } else {
      this.network.setOptions({
        layout: {
          randomSeed: 2,
          hierarchical: {
            enabled: false,
          },
          improvedLayout: true,
        },
      });
    }
  }

  addEdgeMode() {
    this.addingEdgeMode = true;
    this.network.addEdgeMode();
  }

  cancelAddEdgeMode() {
    this.addingEdgeMode = false;
    this.network.disableEditMode();
  }

  generateNodes() {
    const arrayNodesVis: NodeVis[] = [];
    this.nodes.forEach((n: Node) => {
      arrayNodesVis.push(this.createNodeVis(n));
    });
    this.nodeVisDataSet = new DataSet(arrayNodesVis);
  }

  generateEdges() {
    const arrayEdgesVis: EdgeVis[] = [];
    this.edges.forEach((e) => {
      arrayEdgesVis.push(this.createEdgeVis(e));
    });
    this.edgeVisDataSet = new DataSet(arrayEdgesVis);
  }

  createEdge(edgeInput: { from: number; to: number }) {
    const edge: Edge = {
      nodeFrom: edgeInput.from,
      nodeTo: edgeInput.to,
    } as Edge;
    this.store.dispatch(GraphManagerActions.createEdge({ edge }));
    const edgeVis = this.createEdgeVis(edge);
    this.edgeVisDataSet?.add(edgeVis);
    this.network.disableEditMode();
    this.addingEdgeMode = false;
  }

  private createNodeVis(node: Node): NodeVis {
    return {
      id: node.id,
      label: node.nodeType.name + ' (' + node.id + ')',
      shape: node.nodeType.shape,
      color: {
        background: node.nodeType.color,
        border: '#000000',
        highlight: {
          background: node.nodeType.color,
          border: '#000000',
        },
      },
    };
  }

  createEdgeVis(e: Edge): EdgeVis {
    return { id: e.id, from: e.nodeFrom, to: e.nodeTo, arrows: 'to' };
  }

  selectNode(node: Node) {
    if (this.nodeSelected && this.nodeSelected.id === node.id) {
    } else {
      this.updateSingleNodeById(node);
    }
  }

  private updateSingleNodeById(node?: Node) {
    if (!node) {
      return;
    }
    this.nodeSelected = this.nodes.find((n) => n.id === node.id);
  }

  toggleMenuFiltros() {
    this.menuFiltrosExpandido = !this.menuFiltrosExpandido;
  }

  nodeConnectedCreated(newNode: Node) {
    this.newNodeAdded = true;
    this.nodeSelected = newNode;
    this.nodes.push(newNode);
    const nodeVis = this.createNodeVis(this.nodeSelected);
    const edgeVis = this.createEdgeVis(newNode.edges[0]);
    this.nodeVisDataSet?.add(nodeVis);
    this.edgeVisDataSet?.add(edgeVis);
  }

  nodeCreated(newNode: Node) {
    this.newNodeAdded = true;
    this.nodeSelected = newNode;
    this.nodes.push(newNode);
    const nodeVis = this.createNodeVis(this.nodeSelected);
    this.nodeVisDataSet?.add(nodeVis);
  }

  nodeUpdated(node: Node) {
    const nodeVis = this.createNodeVis(node);
    this.nodeVisDataSet?.update(nodeVis);
  }

  nodeDeleted(node: Node) {
    this.nodeVisDataSet?.remove(node.id);
    if (this.nodeSelected) {
      this.nodeSelected.edges.forEach((e) => {
        this.edgeVisDataSet?.remove(e.id);
      });
      this.nodeSelected = undefined;
    }
  }

  edgeDeleted(edge: Edge) {
    this.edgeVisDataSet?.remove(edge.id);
    this.nodes.forEach((n) => {
      n.edges = n.edges.filter((e) => e.id !== edge.id);
    });
    this.edges = this.edges.filter((e) => e.id !== edge.id);
    if (this.nodeSelected) {
      this.nodeSelected.edges = this.nodeSelected.edges.filter(
        (e) => e.id !== edge.id
      );
    }
  }

  domainUpdated(updatedNodeDomain: NodeDomain) {
    let newDodeDomain = true;
    this.nodes.forEach((n) => {
      if (n.id === updatedNodeDomain.node.id) {
        n.nodeDomains.forEach((nd) => {
          if (nd.id === updatedNodeDomain.id) {
            nd.values = updatedNodeDomain.values;
            newDodeDomain = false;
          }
        });
      }
    });
    if (newDodeDomain) {
      this.nodes.forEach((n) => {
        if (n.id === updatedNodeDomain.node.id) {
          n.nodeDomains.push(updatedNodeDomain);
        }
      });
    }
    this.nodes = this.nodes.slice(0);
  }
}
