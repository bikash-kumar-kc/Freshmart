interface ILocalstorageTypes {
  type: "auth" | "theme" | "favourites" | "cart";
  data: {
    auth?:{
email: string;
    password: string;
    }
    
    theme?: string;

    product?:ILocalProduct[]
    
  };
}

interface ILocalProduct {
    productId: string;
    quantity: number;
    category?: string;
}

export const saveLocally = ({ type, data }: ILocalstorageTypes): void => {
  const typeEnum = ["auth", "theme", "favourites", "cart"];

  if (!typeEnum.includes(type)) return;

  switch (type) {
    case "auth":
      const { email, password } = data[type]!;
      if (!email?.trim() || !password?.trim()) return;

      const authInfo = {
        email,
        password,
      };

      let authInfoJson;

      try {
        authInfoJson = JSON.stringify(authInfo);
      } catch (error) {
        console.log("Problem in localstorage !");
        console.log(error);
        return;
      }

      localStorage.setItem(type, authInfoJson);
      console.log(type, " stores successfully !");
      break;

    case "theme":
      const { theme } = data;
      if (!theme?.trim()) return;

      const themeInfo = {
        theme,
      };

      let themeJson;

      try {
        themeJson = JSON.stringify(themeInfo);
      } catch (error) {
        console.log("Problem in localstorage !");
        console.log(error);
        return;
      }

      localStorage.setItem(type, themeJson);
      console.log(type, " stores successfully !");

      break;

    case "favourites":
        if(!data.product) return;
      const { productId, category } = data.product[0];

      if (!productId?.trim() || !category?.trim()) return;

      const favInfo = {
        productId,
        category,
      };

      const favLocal = localStorage.getItem(type);

      if (!favLocal) {
        let favJson;
        try {
          favJson = JSON.stringify([favInfo]);
        } catch (error) {
          console.log("Problem in localstorage !");
          console.log(error);
          return;
        }

        localStorage.setItem(type, favJson);
      } else {
        try {
          const favourites: { productId: string; category: string }[] =
            JSON.parse(favLocal);

          const isExist = favourites.some((f) => f.productId === productId);
          if (isExist) return;

          favourites.push(favInfo);

          const favArrayJson = JSON.stringify(favourites);
          localStorage.setItem(type, favArrayJson);
        } catch (error) {
          console.log("Problem in storing local", type);
          console.log(error);
          return;
        }
      }

      break;

    case "cart":

    if(!data.product) return;
    
    const cart = data.product;

     if(!(cart.length > 0)) return;

      

      const cartLocal = localStorage.getItem(type);

      if (!cartLocal) {
        let cartJson;
        try {
          cartJson = JSON.stringify(cart);
        } catch (error) {
          console.log("Problem in localstorage !");
          console.log(error);
          return;
        }

        localStorage.setItem(type, cartJson);
      } else {
        try {

            const cartLocalParse:ILocalProduct[] = JSON.parse(cartLocal);
            const filterCart = cart.map((c)=> cartLocalParse.filter(ci=>ci.productId !==c.productId));
            const newCart = [...cartLocalParse,...filterCart]
        
          const cartArrayJson = JSON.stringify(newCart);
          localStorage.setItem(type, cartArrayJson);
        } catch (error) {
          console.log("Problem in storing local", type);
          console.log(error);
          return;
        }
    break;
    }


        
  }
     
};
