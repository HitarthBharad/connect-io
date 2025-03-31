"use client"
import EmbeddingPlot from '@/components/embeddingPlot';
import Loader from '@/components/Loader/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

type Thought = {
  _id: string;
  position: number[],
  label: string,
  description: string,
  color: string,
};

type Edge = {
  sourceNodeIndex: number,
  targetNodeIndex: number,
  distance: number
}

const VizPage = () => {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [thought, setThought] = useState<Thought[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const fetchEmbeddings = async () => {
      setLoading(true);
      const response = await fetch('/api/viz/get');
      const {edges: graphEdges, nodes} = await response.json();
      setThought(nodes);
      setEdges(graphEdges);
      setLoading(false);
    };

    fetchEmbeddings();
  }, []);

  return (
    <div>
      {
        loading ? (
          <Loader />
        ) : (
          <EmbeddingPlot thoughts={thought} edges={edges} />
        )
      }
    </div>
  );
};

export default VizPage;