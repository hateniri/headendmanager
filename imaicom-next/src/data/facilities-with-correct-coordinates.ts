import { FacilityDetail } from './facilities-with-full-details'
import { generateCoordinatesForPrefecture } from './fix-coordinates'

// 新リスト.csvのデータに正しい座標を適用
export const facilitiesWithCorrectCoordinates: FacilityDetail[] = [
  // 九州エリア - 福岡市の施設のみ残す
  { 
    id: 95, 
    facilityId: "HE_九州_095", 
    name: "宗像HE", 
    region: "九州", 
    prefecture: "福岡県", 
    city: "宗像市", 
    address: "福岡県宗像市", 
    lat: 33.8056, 
    lng: 130.5389, 
    status: "normal", 
    openedYear: 2021, 
    managementOrg: "九州ネットワークセンター", 
    remarks: "",
    // 組織情報
    companyCode: "27",
    regionCode: "九州",
    managementDeptCode: "9814",
    managementDeptName: "九州技術センター",
    stationCode: "2701",
    stationName: "北九州"
  }
]