'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  connections: number[];
}

export function NetworkVisualization() {
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    // Generate random network nodes
    const generateNodes = () => {
      const nodeCount = 20;
      const newNodes: Node[] = [];
      
      for (let i = 0; i < nodeCount; i++) {
        newNodes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          connections: []
        });
      }
      
      // Create connections between nearby nodes
      newNodes.forEach((node, index) => {
        const nearbyNodes = newNodes.filter((otherNode, otherIndex) => {
          if (index === otherIndex) return false;
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          return distance < 25;
        });
        
        node.connections = nearbyNodes.slice(0, 3).map(n => n.id);
      });
      
      setNodes(newNodes);
    };

    generateNodes();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Connections */}
        {nodes.map((node) =>
          node.connections.map((connectedId) => {
            const connectedNode = nodes.find(n => n.id === connectedId);
            if (!connectedNode) return null;
            
            return (
              <motion.line
                key={`${node.id}-${connectedId}`}
                x1={node.x}
                y1={node.y}
                x2={connectedNode.x}
                y2={connectedNode.y}
                stroke="url(#lineGradient)"
                strokeWidth="0.1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: Math.random() * 3
                }}
              />
            );
          })
        )}
        
        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="0.3"
            fill="url(#nodeGradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1,
              delay: node.id * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2
            }}
          />
        ))}
        
        {/* Gradients */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#525252" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#737373" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9ca38c" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#525252" stopOpacity="1" />
            <stop offset="70%" stopColor="#737373" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9ca38c" stopOpacity="0.6" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}