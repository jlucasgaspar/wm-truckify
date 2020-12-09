import React, { createContext, useContext, useState, useCallback } from "react"
import { useToasts } from "react-toast-notifications"
import { useFirestore } from "./Firestore"
import { useStorage } from "./Storage"

const StockContext = createContext({
  productsArray: [],
  setProductsArray: () => {},
  saveProductInStock: async () => {},
  updateProductInStock: async () => {},
  getProductsInStockByCustomer: async () => {},
  getProductHistoric: async () => {}
})

const StockProvider = ({ children }) => {
  const [productsArray, setProductsArray] = useState([])

  const { saveFile } = useStorage()
  const {
    findById, save, saveSubcollection, findWhereByOrder, findByIdSubcollection, update
  } = useFirestore()

  const { addToast } = useToasts()

  const addProductInProductsArray = useCallback(product => {
    const newProduct = {
      ...product,
      key: product.id,
      created_at: Date(),
      updated_at: Date()
    }

    return setProductsArray([newProduct, ...productsArray])
  }, [productsArray])

  const saveProductInStock = useCallback(async ({ savedProduct }) => {
    try {
      const timestamp = Date.now()

      const { snapshot } = await findById({
        collection: "stocks",
        id: savedProduct.id,
      })

      if (snapshot.exists) {
        return addToast(`Produto ${savedProduct.ncm} ${savedProduct.name} - ${savedProduct.quantityType}
          já existe.`, {
            appearance: "error"
        })
      }

      let url = ""

      if (savedProduct.file) {
        url = await saveFile({
          folder: "stocks",
          filename: savedProduct.file.name,
          savedFile: savedProduct.file,
          errMsg:`Erro ao salvar o arquivo ${savedProduct.file.name}`
        })
      }

      const savedProductData = {
        ...savedProduct,
        file: url
      }

      await save({
        collection: "stocks",
        id: savedProduct.id,
        savedData: savedProductData,
        errMsg: `Erro ao salvar o produto ${savedProduct.ncm} ${savedProduct.name} -
          ${savedProduct.quantityType}
        `
      })

      await saveSubcollection({
        collection: "stocks",
        id: savedProduct.id,
        subcollection: "historic",
        subId: `${savedProduct.id}_${timestamp}`,
        savedData: {
          ...savedProduct,
          id: `${savedProduct.id}_${timestamp}`,
          status: "deposit",
          file: url,
          nf_number: ""
        },
        successMsg: `Produto ${savedProduct.ncm} ${savedProduct.name} - ${savedProduct.quantityType}
          adicionado com sucesso.
        `,
        errMsg: `Erro ao adicionar o produto ${savedProduct.ncm} ${savedProduct.name} -
          ${savedProduct.quantityType}
        `
      })

      const newProduct = {
        ...savedProduct,
        file: url
      }

      return addProductInProductsArray(newProduct)
    } catch (err) {
      console.log("useStock Error: ", err)

      return addToast(`Erro ao adicionar o produto ${savedProduct.ncm} ${savedProduct.name} -
        ${savedProduct.quantityType}`, {
          appearance: "error"
      })
    }
  }, [addToast, findById, save, saveFile, saveSubcollection, addProductInProductsArray])

  const updateProductInStock = useCallback(async ({ updatedProduct, currentProduct }) => {
    try {
      if (!updatedProduct.status) {
        return addToast("Selecione se foi depósito ou retirada.", { appearance: "error" })
      }

      if (currentProduct.quantity + updatedProduct.quantity < 0) {
        return addToast(`Esse pedido possui mais quantidade do produto ${currentProduct.name} do que
          disponível em estoque.`, { appearance: "error" }
        )
      }

      let url = ""
      if (updatedProduct.file) {
        url = await saveFile({
          folder: "stocks",
          filename: updatedProduct.file.name,
          savedFile: updatedProduct.file,
          errMsg:`Erro ao salvar o arquivo ${updatedProduct.file.name}`
        })
      }

      await update({
        collection: "stocks",
        id: currentProduct.id,
        updatedData: {
          quantity: currentProduct.quantity + updatedProduct.quantity
        }
      })

      const updatedProductData = {
        ...updatedProduct,
        file: url
      }

      await saveSubcollection({
        collection: "stocks",
        id: currentProduct.id,
        subcollection: "historic",
        subId: updatedProduct.id,
        savedData: updatedProductData,
        successMsg: `Estoque do produto ${currentProduct.name} atualizado.`,
        errMsg: `Erro ao atualizar o estoque do produto ${currentProduct.name}`
      })
    } catch (err) {
      console.log("useStock Error: ", err)
      return addToast(`Erro ao atualizar estoque do produto ${currentProduct.name}`, {
        appearance: "error"
      })
    }
  }, [addToast, saveSubcollection, update, saveFile])

  const getProductsInStockByCustomer = useCallback(async ({ id, errMsg }) => {
    try {
      const { snapshot } = await findWhereByOrder({
        collection: "stocks",
        whereField: "customer_id",
        whereValue: id,
        orderField: "created_at",
        errMsg: errMsg
      })

      const array = []
      await snapshot.forEach(doc => {
        array.push({
          ...doc.data(),
          date: doc.data().date.toDate(),
          date_table: new Date(doc.data().date.toDate()).toLocaleDateString("pt-br"),
          timestamp: new Date(doc.data().date.toDate()).getTime()
        })
      })

      return array
    } catch (err) {
      console.log("useStock Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [findWhereByOrder, addToast])

  const getProductHistoric = useCallback(async ({ currentProduct, errMsg }) => {
    try {
      const { snapshot } =  await findByIdSubcollection({
        collection: "stocks",
        id: currentProduct.id,
        subcollection: "historic",
        errMsg: `Erro ao carregar o histórico do ${currentProduct.name}`
      })

      const array = []
      snapshot.forEach(doc => {
        array.push({
          ...doc.data(),
          key: doc.id,
          date: doc.data().date.toDate(),
          timestamp: new Date(doc.data().date.toDate()).getTime()
        })
      })

      return array
    } catch (err) {
      console.log("useStock Error: ", err)

      if (errMsg) {
        return addToast(errMsg, { appearance: "error" })
      }
    }
  }, [findByIdSubcollection, addToast])

  return (
    <StockContext.Provider 
      value={{
        productsArray: productsArray,
        setProductsArray,
        saveProductInStock,
        updateProductInStock,
        getProductsInStockByCustomer,
        getProductHistoric
      }}
    >
      {children}
    </StockContext.Provider>
  )
}

const useStock = () => {
  const context = useContext(StockContext)

  if (!context) {
    throw new Error("useStock must be used within an StockProvider.")
  }

  return context
}

export { StockProvider, useStock }