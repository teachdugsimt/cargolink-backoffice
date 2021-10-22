import { AxiosResponse } from "axios"
import { types, flow, cast } from "mobx-state-tree"
import { TruckTypeApi, RegionApi, ProductTypeApi } from "../services"
import { IProductType } from "../services/product-type-api"
import { ParamsProvince, Province } from "../services/region-api"
import { ITruckType } from "../services/truck-type-api"

const InitialType = {
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
  groupId: types.maybeNull(types.number),
}

const InitialTruckTypeDropdown = types.model({
  label: types.maybeNull(types.string),
  value: types.maybeNull(types.number),
})

const TruckTypeGroup = types.model(InitialType)

const regionModel = types.model({
  label: types.maybeNull(types.string),
  value: types.maybeNull(types.number)
})

const provinceModel = types.model({
  label: types.maybeNull(types.string),
  value: types.maybeNull(types.number)
})

const productDropdownModel = types.model({
  label: types.maybeNull(types.string),
  value: types.maybeNull(types.number)
})

const InitialProductType = types.model({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
})

export const VersatileStore = types.model({
  list: types.maybeNull(types.array(TruckTypeGroup)),
  listDropdown: types.maybeNull(types.array(InitialTruckTypeDropdown)),
  list_loading: types.boolean,
  error: types.maybeNull(types.string),

  region: types.maybeNull(types.array(regionModel)),
  loading_region: types.boolean,
  error_region: types.maybeNull(types.string),

  province: types.maybeNull(types.array(provinceModel)),
  loading_province: types.boolean,
  error_province: types.maybeNull(types.string),

  list_product_type: types.maybeNull(types.array(productDropdownModel)),
  list_product_type_pure: types.maybeNull(types.array(InitialProductType)),
  product_type_loading: types.boolean,
  product_type_error: types.maybeNull(types.string),
}).actions(self => ({
  find: flow(function* find() {
    if (!self.list || !self.listDropdown) {
      self.list_loading = true
      try {
        const response = yield TruckTypeApi.getTruckTypes()
        console.log("Response call api get truck type : : ", response)
        if (response?.ok) {
          const types: ITruckType[] = response.data.sort((a: any, b: any) => a.id - b.id);
          const options = types.map((type) => ({
            label: type.name,
            value: type.id,
          }));
          console.log("Options dropdown in store :: ", options)
          // this.setState({ options, items: types });
          self.list = types
          self.listDropdown = options
        }
        else self.error = `Something went wrong !`
        self.list_loading = false
      } catch (error) {
        console.error("Failed to fetch get truck type : ", error)
        self.list_loading = false
        self.error = "error fetch api get truck type"
      }
    }
  }),

  findProductType: flow(function* findProductType() {
    if (!self.list_product_type || !self.list_product_type_pure) {
      self.product_type_loading = true
      try {
        const response: AxiosResponse<IProductType[]> = yield ProductTypeApi.getProductTypes()
        console.log("Response call api get product type : : ", response)
        if (response.ok) {
          self.list_product_type_pure = response.data || []
          let tmp: IProductType[] = JSON.parse(JSON.stringify(response.data)) || []
          console.log(`🚀  ->  tmp`, tmp);
          let res: any = tmp.map((e: any, i: number) => {
            return {
              label: e.name,
              value: e.id
            }
          })
          console.log(`🚀  ->  res`, res);
          let sortData = res.sort(function (a: any, b: any) {
            if (a.label.charAt(0).toLowerCase() < b.label.charAt(0).toLowerCase()) { return -1; }
            if (a.label.charAt(0).toLowerCase() > b.label.charAt(0).toLowerCase()) { return 1; }
            return 0;
          })
          console.log(`🚀  ->  sortData`, sortData);

          self.list_product_type = sortData


        } else {
          self.list_product_type = null
          self.list_product_type_pure = null
        }
        self.product_type_loading = false
      } catch (error) {
        console.error("Failed to fetch get product type : ", error)
        self.product_type_loading = false
        self.product_type_error = "error fetch api get product type"
      }
    }
  }),


  getRegion: flow(function* getRegion() {
    self.loading_region = true
    try {
      const response = yield RegionApi.getRegionList()
      console.log("Response call get region Mobx : : ", response)
      if (response.ok) {
        let tmp = JSON.parse(JSON.stringify(response.data)) || null
        let res = tmp.map((e: any) => {
          res.push({
            label: e.name,
            value: e.id
          })
        })
        self.region = res
        self.loading_region = false
      } else {
        self.loading_region = false
        self.error = "error fetch get province"
      }
    } catch (error) {
      console.error("Failed to store value get province : ", error)
      self.loading_region = false
      self.error_region = "set up state mobx error"
    }
  }),

  getProvince: flow(function* getProvince(params: ParamsProvince = {}) {
    if (!self.province) {
      self.loading_province = true
      try {
        const response: AxiosResponse<Province[]> = yield RegionApi.getProvincesList(params)
        console.log("Response call get province Mobx : : ", response)
        if (response.ok) {
          let tmp: Province[] = JSON.parse(JSON.stringify(response.data)) || []
          let res: any = tmp.map((e: any, i: number) => {
            return {
              label: e.name,
              value: e.id
            }
          })
          let sortData = res.sort(function (a: any, b: any) {
            if (a.label.charAt(0).toLowerCase() < b.label.charAt(0).toLowerCase()) { return -1; }
            if (a.label.charAt(0).toLowerCase() > b.label.charAt(0).toLowerCase()) { return 1; }
            return 0;
          })

          self.province = sortData || []
          self.loading_province = false
        } else {
          self.loading_province = false
          self.error_province = "error fetch get province"
        }
      } catch (error) {
        // ... including try/catch error handling => types in response failure
        console.error("Failed to store value get province : ", error)
        self.loading_province = false
        self.error_province = "set up state mobx error"
      }
    }
  }),

}))
