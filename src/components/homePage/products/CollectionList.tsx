import HorizontalProductList from "./HorizontalProductList";
import React from "react";
import { Collection } from "@/lib/models/collectionModal";
import { transformProductToCollectionCartItem } from "@/utils/trnsformProductsCollecionCardOItem";

interface CollectionListProp {
  collection: Collection;
}

const CollectionList: React.FC<CollectionListProp> = ({ collection }) => {
  const displayedProducts = collection.products.map(
    transformProductToCollectionCartItem
  );

  return (
    <div >
      <HorizontalProductList
        id={collection.collection_id}
        title={collection.name}
        products={displayedProducts}
      />
    </div>
  );
};

export default CollectionList;
