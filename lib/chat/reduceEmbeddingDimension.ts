import * as UMAP from "umap-js";

const reduceEmbeddingDimension = (
  newEmbedding: number[],
  initialEmbeddings: number[][]
) => {
  const umap = new UMAP.UMAP({
    nNeighbors: 15,
    minDist: 0.1,
    nComponents: 3,
  });

  umap.fit(initialEmbeddings);

  const reduced = umap.transform([newEmbedding]);

  return reduced[0];
};

export default reduceEmbeddingDimension;