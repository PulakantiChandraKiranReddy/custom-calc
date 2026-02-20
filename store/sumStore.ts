import { create } from "zustand";

export interface KitchenWoodItem {
  id: number;
  name: string;
  type: string;
  rate: number;
  walls: Record<string, number>; // e.g., { "wall 1": 10, "wall 2": 20 }
  totalSqft: number;
  total: number;
}

export interface WardrobeWoodItem {
  id: number;
  finish: string;
  length: number;
  height: number;
  totalSqft: number;
  total: number;
}

export interface AccessoryItem {
  id: number;
  name: string;
  brand?: string;
  size?: string;
  uom: number;
  price: number;
  total: number;
}

export interface ServiceItem {
  id: number;
  name: string; // Renamed from description
  specification: string;
  description: string;
  rate: number;
  quantity?: number; // Some services might be lump sum or quantity based
  unit?: string;
  total: number;
}

interface SolutionState {
  withoutGst: number;
  discountTotal: number;
  withGst: number;
  handlingFee: number;
  discountPercentage: number;
}

interface TotalSumState {
  kitchenWood: number;
  kitchenAccessories: number;
  wardrobeWood: number;
  wardrobeAccessories: number;
  
  // Detailed Items
  kitchenWoodItems: KitchenWoodItem[];
  kitchenAccessoryItems: AccessoryItem[];
  wardrobeWoodItems: WardrobeWoodItem[];
  wardrobeAccessoryItems: AccessoryItem[];
  serviceItems: ServiceItem[];
  
  estimateId: string;

  solution: SolutionState;
}

interface TotalSumActions {
  setKitchenWood: (total: number) => void;
  setKitchenAccessory: (total: number) => void;
  setWardrobeWood: (total: number) => void;
  setWardrobeAccessories: (total: number) => void;
  setSolution: (solution: SolutionState) => void;

  setEstimateId: (id: string) => void;

  // Setters for detailed items
  setKitchenWoodItems: (items: KitchenWoodItem[]) => void;
  setKitchenAccessoryItems: (items: AccessoryItem[]) => void;
  setWardrobeWoodItems: (items: WardrobeWoodItem[]) => void;
  setWardrobeAccessoryItems: (items: AccessoryItem[]) => void;
  setServiceItems: (items: ServiceItem[]) => void;
}

// Create a Zustand store with typed state and actions
const useTotalSumStore = create<TotalSumState & TotalSumActions>((set) => ({
  kitchenWood: 0,
  kitchenAccessories: 0,
  wardrobeWood: 0,
  wardrobeAccessories: 0,
  
  kitchenWoodItems: [],
  kitchenAccessoryItems: [],
  wardrobeWoodItems: [],
  wardrobeAccessoryItems: [],
  serviceItems: [],
  
  estimateId: "",

  solution: { withGst: 0, withoutGst: 0, discountTotal: 0, handlingFee: 0, discountPercentage: 1 },
  
  setKitchenWood: (total: number) => set({ kitchenWood: total }),
  setKitchenAccessory: (total: number) => set({ kitchenAccessories: total }),
  setWardrobeWood: (total: number) => set({ wardrobeWood: total }),
  setWardrobeAccessories: (total: number) => set({ wardrobeAccessories: total }),
  setSolution: (solution: SolutionState) => set({ solution }),

  setEstimateId: (id: string) => set({ estimateId: id }),

  setKitchenWoodItems: (items: KitchenWoodItem[]) => set({ kitchenWoodItems: items }),
  setKitchenAccessoryItems: (items: AccessoryItem[]) => set({ kitchenAccessoryItems: items }),
  setWardrobeWoodItems: (items: WardrobeWoodItem[]) => set({ wardrobeWoodItems: items }),
  setWardrobeAccessoryItems: (items: AccessoryItem[]) => set({ wardrobeAccessoryItems: items }),
  setServiceItems: (items: ServiceItem[]) => set({ serviceItems: items }),
}));

export default useTotalSumStore;
