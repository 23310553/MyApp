import React, { Component } from 'react';
// import clone from 'clone';
import Tree from 'react-d3-tree';
import Switch from './Switch';
import PureSvgNodeElement from './PureSvgNodeElement';
import '../App.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../config/firebase';
import AssignLineManager from './assignLineManager';
import AddEmployeeDataForm from './addNewEmployee';
// import MyTable from './myTable';
// import { Auth } from './auth';



async function fetchData() {
    var associateData = {};

    try {
      // First, get users' data
      const userCollectionRef = collection(db, 'associates');
      const userSnapshot = await getDocs(userCollectionRef);

      userSnapshot.forEach((userDoc) => {

        var userDocData = userDoc.data();

        if (!associateData[userDoc.id]) {
            userDocData = {
                id: userDoc.id,
                ...userDocData
            }

            associateData[userDoc.id] = userDocData;

            if (!userDocData.ReportsTo) {
                associateData[null] = userDocData;
            }
        }
      });

      const reporteesData = Object.entries(associateData).reduce((acc, [key, value]) => {
        if (!key || key == "null") return acc;

        const { children = [] } = acc;
        const { ReportsTo } = value;
        const { id = null } = ReportsTo || {}
        const { reportees: existing = [] } = acc[id] || {};
        const reportee = id ? associateData[key] : []

        return {
            ...acc,
            [id] : {
                ...associateData[id],
                reportees: [...existing, reportee]
            }
        }
      }, {})

      const ceo = reporteesData[null]
      return mergeIntoTree(associateData[ceo.id], reporteesData, associateData)

    } catch (error) {
      console.error('Error fetching data:', error);
    }

    return {}
  }

function mergeIntoTree(associateData, reporteesData, allData) {
    var mergedItem = {
        name: associateData.Surname + ", " + associateData.Name,
        attributes:[],
        children: []
    }

    reporteesData[associateData.id]?.reportees?.forEach(reportee => {
       mergedItem.children.push(mergeIntoTree(allData[reportee.id], reporteesData, allData))
    })

    return mergedItem;
}



const customNodeFnMapping = {
  svg: {
    description: 'Default - Pure SVG node & label (IE11 compatible)',
    fn: (rd3tProps, appState) => (
      <PureSvgNodeElement
        nodeDatum={rd3tProps.nodeDatum}
        toggleNode={rd3tProps.toggleNode}
        orientation={appState.orientation}
      />
    ),
  },
};

const countNodes = (count = 0, n) => {
  // Count the current node
  count += 1;

  // Base case: reached a leaf node.
  if (!n.children) {
    return count;
  }

  // Keep traversing children while updating `count` until we reach the base case.
  return n.children.reduce((sum, child) => countNodes(sum, child), count);
};

class MyTree extends Component {
  constructor() {
    super();

    this.addedNodesCount = 0;

    this.state = {
      data: {},
      totalNodeCount: countNodes(0, Array.isArray({}) ? {}[0] : {}),
      orientation: 'horizontal',
      dimensions: undefined,
      centeringTransitionDuration: 800,
      translateX: 200,
      translateY: 300,
      collapsible: true,
      shouldCollapseNeighborNodes: false,
      initialDepth: 1,
      depthFactor: undefined,
      zoomable: true,
      draggable: true,
      zoom: 1,
      scaleExtent: { min: 0.1, max: 1 },
      separation: { siblings: 2, nonSiblings: 2 },
      nodeSize: { x: 200, y: 200 },
      enableLegacyTransitions: false,
      transitionDuration: 500,
      renderCustomNodeElement: customNodeFnMapping['svg'].fn,
      styles: {
        nodes: {
          node: {
            circle: {
              fill: '#cc66ff',
            },
            attributes: {
              stroke: '#000',
            },
          },
          leafNode: {
            circle: {
              fill: 'transparent',
            },
            attributes: {
              stroke: '#000',
            },
          },
        },
      },
    };

    this.setTreeData = this.setTreeData.bind(this);
    this.setOrientation = this.setOrientation.bind(this);
    this.setPathFunc = this.setPathFunc.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFloatChange = this.handleFloatChange.bind(this);
    this.toggleCollapsible = this.toggleCollapsible.bind(this);
    this.toggleZoomable = this.toggleZoomable.bind(this);
    this.toggleDraggable = this.toggleDraggable.bind(this);
    this.toggleCenterNodes = this.toggleCenterNodes.bind(this);
    this.setScaleExtent = this.setScaleExtent.bind(this);
    this.setSeparation = this.setSeparation.bind(this);
    this.setNodeSize = this.setNodeSize.bind(this);
  }

  setTreeData(data) {
    this.setState({
      data,
      totalNodeCount: countNodes(0, Array.isArray(data) ? data[0] : data),
    });
  }

  setOrientation(orientation) {
    this.setState({ orientation });
  }

  setPathFunc(pathFunc) {
    this.setState({ pathFunc });
  }

  handleChange(evt) {
    const target = evt.target;
    const parsedIntValue = parseInt(target.value, 10);
    if (target.value === '') {
      this.setState({
        [target.name]: undefined,
      });
    } else if (!isNaN(parsedIntValue)) {
      this.setState({
        [target.name]: parsedIntValue,
      });
    }
  }

  handleFloatChange(evt) {
    const target = evt.target;
    const parsedFloatValue = parseFloat(target.value);
    if (target.value === '') {
      this.setState({
        [target.name]: undefined,
      });
    } else if (!isNaN(parsedFloatValue)) {
      this.setState({
        [target.name]: parsedFloatValue,
      });
    }
  }

  handleCustomNodeFnChange = evt => {
    const customNodeKey = evt.target.value;

    this.setState({ renderCustomNodeElement: customNodeFnMapping[customNodeKey].fn });
  };

  toggleCollapsible() {
    this.setState(prevState => ({ collapsible: !prevState.collapsible }));
  }

  toggleCollapseNeighborNodes = () => {
    this.setState(prevState => ({
      shouldCollapseNeighborNodes: !prevState.shouldCollapseNeighborNodes,
    }));
  };

  toggleZoomable() {
    this.setState(prevState => ({ zoomable: !prevState.zoomable }));
  }

  toggleDraggable() {
    this.setState(prevState => ({ draggable: !prevState.draggable }));
  }

  toggleCenterNodes() {
    if (this.state.dimensions !== undefined) {
      this.setState({
        dimensions: undefined,
      });
    } else {
      if (this.treeContainer) {
        const { width, height } = this.treeContainer.getBoundingClientRect();
        this.setState({
          dimensions: {
            width,
            height,
          },
        });
      }
    }
  }

  setScaleExtent(scaleExtent) {
    this.setState({ scaleExtent });
  }

  setSeparation(separation) {
    if (!isNaN(separation.siblings) && !isNaN(separation.nonSiblings)) {
      this.setState({ separation });
    }
  }

  setNodeSize(nodeSize) {
    if (!isNaN(nodeSize.x) && !isNaN(nodeSize.y)) {
      this.setState({ nodeSize });
    }
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    fetchData().then(data => this.setTreeData(data))

    this.setState({
      translateX: dimensions.width / 2.5,
      translateY: dimensions.height / 2,
    });
  }

  render() {
    return (
        <>
      <div className="App">
        <div className="demo-container">
          <div className="column-left">
            <div className="controls-container">
              <div className="prop-container">
                <h2 className="title">Tree Hierarchy Model</h2>
                <h3 className="title">
                  Epi Use employee hierarchy management
                </h3>              
              </div>

              <div className="prop-container">
                <h4 className="prop">Orientation</h4>
                <button
                  type="button"
                  className="btn btn-controls btn-block"
                  onClick={() => this.setOrientation('horizontal')}
                >
                  {'Horizontal'}
                </button>
                <button
                  type="button"
                  className="btn btn-controls btn-block"
                  onClick={() => this.setOrientation('vertical')}
                >
                  {'Vertical'}
                </button>
              </div>

              <div className="prop-container">
                <h4 className="prop">Path Function</h4>
                <button
                  type="button"
                  className="btn btn-controls btn-block"
                  onClick={() => this.setPathFunc('diagonal')}
                >
                  {'Diagonal'}
                </button>
                <button
                  type="button"
                  className="btn btn-controls btn-block"
                  onClick={() => this.setPathFunc('elbow')}
                >
                  {'Elbow'}
                </button>
                <button
                  type="button"
                  className="btn btn-controls btn-block"
                  onClick={() => this.setPathFunc('straight')}
                >
                  {'Straight'}
                </button>
                <button
                  type="button"
                  className="btn btn-controls btn-block"
                  onClick={() => this.setPathFunc('step')}
                >
                  {'Step'}
                </button>
              </div>

              <div className="prop-container">
                <h4 className="prop">Collapsible</h4>
                <Switch
                  name="collapsibleBtn"
                  checked={this.state.collapsible}
                  onChange={this.toggleCollapsible}
                />
              </div>

              <div className="prop-container">
                <h4 className="prop">Zoomable</h4>
                <Switch
                  name="zoomableBtn"
                  checked={this.state.zoomable}
                  onChange={this.toggleZoomable}
                />
              </div>

              <div className="prop-container">
                <h4 className="prop">Draggable</h4>
                <Switch
                  name="draggableBtn"
                  checked={this.state.draggable}
                  onChange={this.toggleDraggable}
                />
              </div>

              <div className="prop-container">
                <h4 className="prop">
                  Center Nodes on Click (via <code>dimensions</code> prop)
                </h4>
                <Switch
                  name="centerNodesBtn"
                  checked={this.state.dimensions !== undefined}
                  onChange={this.toggleCenterNodes}
                />
              </div>

              <div className="prop-container">
                <h4 className="prop">Collapse neighbor nodes</h4>
                <Switch
                  name="collapseNeighborsBtn"
                  checked={this.state.shouldCollapseNeighborNodes}
                  onChange={this.toggleCollapseNeighborNodes}
                />
              </div>

              <div className="prop-container">
                <h4 className="prop">Enable Legacy Transitions</h4>
                <Switch
                  name="enableLegacyTransitionsBtn"
                  checked={this.state.enableLegacyTransitions}
                  onChange={() =>
                    this.setState(prevState => ({
                      enableLegacyTransitions: !prevState.enableLegacyTransitions,
                    }))
                  }
                />
              </div>

              <div className="prop-container">
                <div>
                  <label className="prop" htmlFor="translateX">
                    Translate X
                  </label>
                  <input
                    className="form-control"
                    name="translateX"
                    type="number"
                    value={this.state.translateX}
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  <label className="prop" htmlFor="translateY">
                    Translate Y
                  </label>
                  <input
                    className="form-control"
                    name="translateY"
                    type="number"
                    value={this.state.translateY}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="prop-container">
                <label className="prop" htmlFor="initialDepth">
                  Initial Depth
                </label>
                <input
                  className="form-control"
                  style={{ color: 'grey' }}
                  name="initialDepth"
                  type="text"
                  value={this.state.initialDepth}
                  onChange={this.handleChange}
                />
              </div>

              <div className="prop-container">
                <label className="prop" htmlFor="depthFactor">
                  Depth Factor
                </label>
                <input
                  className="form-control"
                  name="depthFactor"
                  type="number"
                  defaultValue={this.state.depthFactor}
                  onChange={this.handleChange}
                />
              </div>

              {/* <div className="prop-container prop">{`Zoomable: ${this.state.zoomable}`}</div> */}

              <div className="prop-container">
                <label className="prop" htmlFor="zoom">
                  Zoom
                </label>
                <input
                  className="form-control"
                  name="zoom"
                  type="number"
                  defaultValue={this.state.zoom}
                  onChange={this.handleFloatChange}
                />
              </div>

              <div className="prop-container">
                <span className="prop prop-large">Scale Extent</span>
                <label className="sub-prop" htmlFor="scaleExtentMin">
                  Min
                </label>
                <input
                  className="form-control"
                  name="scaleExtentMin"
                  type="number"
                  defaultValue={this.state.scaleExtent.min}
                  onChange={evt =>
                    this.setScaleExtent({
                      min: parseFloat(evt.target.value),
                      max: this.state.scaleExtent.max,
                    })
                  }
                />
                <label className="sub-prop" htmlFor="scaleExtentMax">
                  Max
                </label>
                <input
                  className="form-control"
                  name="scaleExtentMax"
                  type="number"
                  defaultValue={this.state.scaleExtent.max}
                  onChange={evt =>
                    this.setScaleExtent({
                      min: this.state.scaleExtent.min,
                      max: parseFloat(evt.target.value),
                    })
                  }
                />
              </div>

              <div className="prop-container">
                <span className="prop prop-large">Node separation</span>
                <label className="sub-prop" htmlFor="separationSiblings">
                  Siblings
                </label>
                <input
                  className="form-control"
                  name="separationSiblings"
                  type="number"
                  defaultValue={this.state.separation.siblings}
                  onChange={evt =>
                    this.setSeparation({
                      siblings: parseFloat(evt.target.value),
                      nonSiblings: this.state.separation.nonSiblings,
                    })
                  }
                />
                <label className="sub-prop" htmlFor="separationNonSiblings">
                  Non-Siblings
                </label>
                <input
                  className="form-control"
                  name="separationNonSiblings"
                  type="number"
                  defaultValue={this.state.separation.nonSiblings}
                  onChange={evt =>
                    this.setSeparation({
                      siblings: this.state.separation.siblings,
                      nonSiblings: parseFloat(evt.target.value),
                    })
                  }
                />
              </div>

              <div className="prop-container">
                <span className="prop prop-large">Node size</span>
                <label className="sub-prop" htmlFor="nodeSizeX">
                  X
                </label>
                <input
                  className="form-control"
                  name="nodeSizeX"
                  type="number"
                  defaultValue={this.state.nodeSize.x}
                  onChange={evt =>
                    this.setNodeSize({ x: parseFloat(evt.target.value), y: this.state.nodeSize.y })
                  }
                />
                <label className="sub-prop" htmlFor="nodeSizeY">
                  Y
                </label>
                <input
                  className="form-control"
                  name="nodeSizeY"
                  type="number"
                  defaultValue={this.state.nodeSize.y}
                  onChange={evt =>
                    this.setNodeSize({ x: this.state.nodeSize.x, y: parseFloat(evt.target.value) })
                  }
                />
              </div>

              <div className="prop-container">
                <label className="prop" htmlFor="transitionDuration">
                  Transition Duration
                </label>
                <input
                  className="form-control"
                  name="transitionDuration"
                  type="number"
                  value={this.state.transitionDuration}
                  onChange={this.handleChange}
                />
              </div>
              <div className="prop-container">
                <label className="prop" htmlFor="centeringTransitionDuration">
                  Centering Transition Duration
                </label>
                <input
                  className="form-control"
                  name="centeringTransitionDuration"
                  type="number"
                  value={this.state.centeringTransitionDuration}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>

          <div className="column-right">
            <div className="tree-stats-container">
              Total nodes in tree: {this.state.totalNodeCount}
            </div>
            <div ref={tc => (this.treeContainer = tc)} className="tree-container">
              <Tree
                hasInteractiveNodes
                data={this.state.data}
                renderCustomNodeElement={
                  this.state.renderCustomNodeElement
                    ? rd3tProps => this.state.renderCustomNodeElement(rd3tProps, this.state)
                    : undefined
                }
                rootNodeClassName="demo-node"
                branchNodeClassName="demo-node"
                orientation={this.state.orientation}
                dimensions={this.state.dimensions}
                centeringTransitionDuration={this.state.centeringTransitionDuration}
                translate={{ x: this.state.translateX, y: this.state.translateY }}
                pathFunc={this.state.pathFunc}
                collapsible={this.state.collapsible}
                initialDepth={this.state.initialDepth}
                zoomable={this.state.zoomable}
                draggable={this.state.draggable}
                zoom={this.state.zoom}
                scaleExtent={this.state.scaleExtent}
                nodeSize={this.state.nodeSize}
                separation={this.state.separation}
                enableLegacyTransitions={this.state.enableLegacyTransitions}
                transitionDuration={this.state.transitionDuration}
                depthFactor={this.state.depthFactor}
                styles={this.state.styles}
                shouldCollapseNeighborNodes={this.state.shouldCollapseNeighborNodes}
                // onUpdate={(...args) => {console.log(args)}}
                onNodeClick={(node, evt) => {
                  console.log('onNodeClick', node, evt);
                }}
                onNodeMouseOver={(...args) => {
                  console.log('onNodeMouseOver', args);
                }}
                onNodeMouseOut={(...args) => {
                  console.log('onNodeMouseOut', args);
                }}
                onLinkClick={(...args) => {
                  console.log('onLinkClick');
                  console.log(args);
                }}
                onLinkMouseOver={(...args) => {
                  console.log('onLinkMouseOver', args);
                }}
                onLinkMouseOut={(...args) => {
                  console.log('onLinkMouseOut', args);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default MyTree;
