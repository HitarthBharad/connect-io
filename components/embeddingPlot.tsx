// "use client";

// import CytoscapeComponent from "react-cytoscapejs";
// import cytoscape from "cytoscape";
// import fcose from "cytoscape-fcose"; // Import the fcose layout
// import { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

// cytoscape.use(fcose); // Register the fcose layout

// type Thought = {
//   _id: string;
//   embedding: number[];
//   name: string;
//   reducedEmbedding: number[];
//   text: string;
//   topics: string[];
//   userId: string;
// };

// type Edge = {
//   sourceNodeIndex: number;
//   targetNodeIndex: number;
//   distance: number; // Pre-calculated distance
// };

// interface EmbeddingPlotProps {
//   thoughts: Thought[];
//   edges: Edge[]; // Array of Edge objects
// }

// const EmbeddingPlot = ({ thoughts, edges }: EmbeddingPlotProps) => {
//   const [elements, setElements] = useState<any[]>([]);
//   const [selectedThought, setSelectedThought] = useState<Thought | null>(null);

//   useEffect(() => {
//     if (thoughts.length > 0) {
//       // Create nodes with reducedEmbedding as position
//       const nodes = thoughts.map((thought, index) => ({
//         data: {
//           id: `node-${index}`,
//           label: thought.name,
//           thoughtIndex: index,
//         },
//         position: {
//           x: thought.reducedEmbedding[0] * 50, // Scale positions
//           y: thought.reducedEmbedding[1] * 50,
//         },
//       }));

//       // Create edges using the pre-calculated distance
//       const edgeList = edges.map(({ sourceNodeIndex, targetNodeIndex, distance }) => ({
//         data: {
//           id: `edge-${sourceNodeIndex}-${targetNodeIndex}`,
//           source: `node-${sourceNodeIndex}`,
//           target: `node-${targetNodeIndex}`,
//           distance,
//         },
//       }));

//       setElements([...nodes, ...edgeList]);
//     }
//   }, [thoughts, edges]);

//   // Handle node click to open dialog
//   const handleNodeClick = (event: any) => {
//     const nodeData = event.target.data();
//     const index = nodeData.thoughtIndex;
//     setSelectedThought(thoughts[index]);
//   };

//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       {/* Cytoscape Graph */}
//       {elements.length > 0 && (
//         <CytoscapeComponent
//           elements={elements}
//           style={{ width: "100%", height: "100%" }}
//           layout={{
//             name: "fcose",
//             idealEdgeLength: (edge: any) => edge.data("distance") * 50, // Use pre-calculated distance
//             edgeLengthFactor: 1,
//             nodeSeparation: 50,
//             padding: 50,
//             nodeDimensionsIncludeLabels: true,
//             randomize: false, // Set to false for consistent layout
//             fit: true, // Fit only once after rendering
//           } as any}
//           cy={(cy) => {
//             // Prevent layout reset on node click
//             cy.on("tap", "node", handleNodeClick);

//             // Lock positions after initial layout
//             cy.on("layoutstop", () => {
//               cy.batch(() => {
//                 cy.nodes().forEach((node) => {
//                   node.lock(); // Lock node positions after layout
//                 });
//               });
//             });

//             // Optional: Fit once after initial render
//             cy.ready(() => {
//               cy.fit();
//             });
//           }}
//           stylesheet={[
//             {
//               selector: "node",
//               style: {
//                 width: 10,
//                 height: 10,
//                 backgroundColor: "#4A90E2",
//                 "border-width": 1.5,
//                 "border-color": "#1C3FAA",
//                 label: "data(label)",
//                 "text-valign": "top",
//                 "text-halign": "center",
//                 "font-size": 8,
//                 "text-outline-color": "#fff",
//                 "text-outline-width": 0.5,
//                 color: "#333",
//                 "text-background-color": "#f5f5f5",
//                 "text-background-opacity": 0.9,
//                 "text-background-padding": 2,
//                 "text-margin-y": 4,
//                 "text-border-radius": 3,
//                 "transition-property": "background-color, width, height",
//                 "transition-duration": "0.2s",
//               },
//             },
//             {
//               selector: "node:hover",
//               style: {
//                 width: 14,
//                 height: 14,
//                 backgroundColor: "#1C3FAA",
//                 "border-width": 2,
//                 "border-color": "#4A90E2",
//                 "font-size": 10,
//                 "text-outline-width": 1,
//               },
//             },
//             {
//               selector: "edge",
//               style: {
//                 width: 0.8,
//                 "line-color": "#B0BEC5",
//                 "target-arrow-color": "#B0BEC5",
//                 "target-arrow-shape": "triangle",
//                 "curve-style": "bezier",
//                 opacity: 0.7,
//               },
//             },
//             {
//               selector: "edge:hover",
//               style: {
//                 width: 1.5,
//                 "line-color": "#607D8B",
//                 "target-arrow-color": "#607D8B",
//                 opacity: 1,
//               },
//             },
//             {
//               selector: ":selected",
//               style: {
//                 "border-width": 3,
//                 "border-color": "#FF7043",
//                 "background-color": "#FFAB91",
//                 "text-outline-width": 2,
//                 "text-outline-color": "#FF7043",
//               },
//             },
//           ]}
//         />
//       )}

//       {/* Dialog to show thought content */}
//       {selectedThought && (
//         <Dialog open={!!selectedThought} onOpenChange={() => setSelectedThought(null)}>
//           <DialogContent className="max-w-3xl">
//             <DialogHeader>
//               <DialogTitle>{selectedThought.name}</DialogTitle>
//             </DialogHeader>
//             <div
//               className="p-4 max-h-[400px] overflow-y-auto"
//               dangerouslySetInnerHTML={{ __html: selectedThought.text }}
//             />
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default EmbeddingPlot;

"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import dynamic from "next/dynamic";
import * as THREE from "three";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

type Thought = {
  _id: string;
  position: number[];
  label: string;
  description: string;
  color: string;
};

type Edge = {
  sourceNodeIndex: number;
  targetNodeIndex: number;
  distance: number;
};

interface EmbeddingPlotProps {
  thoughts: Thought[];
  edges: Edge[];
}

const EmbeddingPlot = ({ thoughts, edges }: EmbeddingPlotProps) => {
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const nodes = thoughts.map((thought, index) => ({
    id: `node-${index}`,
    label: thought.label,
    group: thought.color,
    x: thought.position[0] * 50,
    y: thought.position[1] * 50,
    z: thought.position[2] * 50,
    index: index,
    text: thought.description,
  }));

  const links = edges.map(({ sourceNodeIndex, targetNodeIndex, distance }) => ({
    source: `node-${sourceNodeIndex}`,
    target: `node-${targetNodeIndex}`,
    distance,
  }));

  const handleNodeClick = (node: any) => {
    const thoughtIndex = parseInt(node.id.replace("node-", ""));
    setSelectedThought(thoughts[thoughtIndex]);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {windowSize.width > 0 && windowSize.height > 0 && (
        <ForceGraph3D
          graphData={{ nodes, links }}
          nodeAutoColorBy="group"
          nodeLabel="label"
          nodeThreeObject={(node) => {
            const sphere = new THREE.SphereGeometry(10, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: node.color || "0x0077ff" });
            const mesh = new THREE.Mesh(sphere, material);
            return mesh;
          }}
          linkColor={() => "#B0BEC5"}
          linkWidth={2}
          linkOpacity={0.7}
          onNodeClick={handleNodeClick}
          width={windowSize.width}
          height={windowSize.height}
        />
      )}

      {selectedThought && (
        <Dialog open={!!selectedThought} onOpenChange={() => setSelectedThought(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedThought.label}</DialogTitle>
            </DialogHeader>
            <div
              className="p-4 max-h-[400px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: selectedThought.description }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmbeddingPlot;