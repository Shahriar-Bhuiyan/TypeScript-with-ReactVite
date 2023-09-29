import {createContext,ReactElement,useState,useEffect} from 'react'

type ProductType = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

const initProductState: ProductType[] = [];

type UseProductConextType = { products: ProductType[] };

const initContextState: UseProductConextType = { products: [] };
const ProductContext = createContext<UseProductConextType>(initContextState);

type Children = {
    children?:ReactElement|ReactElement[];
}

export const ProductProvider=({children}:Children):ReactElement=>{
    const [products,setProducts]= useState<ProductType[]>(initProductState);

    useEffect(() => {
            const fetchedData = async():Promise<ProductType[]>=>{
                const data = await fetch('https://dummyjson.com/products').then(res=>res.json()).catch(err=>{
                    if(err instanceof Error) console.log(err.message)
                })
            return data.products
            }
            fetchedData().then(products=>setProducts(products))
    }, [])
 console.log(products)
    return(
        <ProductContext.Provider value={{products}}>
            {children}
        </ProductContext.Provider>
    )
}


export default ProductContext

