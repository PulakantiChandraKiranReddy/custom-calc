import { create } from "zustand";


interface solutionObject { withoutGst: number, discountTotal: number, withGst: number, handlingFee: number }
interface TotalSumState {
    kitchenWood: number;
    kitchenAccessories: number;
    wardrobeWood: number;
    wardrobeAccessories: number;
    solution: solutionObject
}

interface TotalSumActions {
    setKitchenWood: (total: number) => void;
    setKitchenAccessory: (total: number) => void;
    setWardrobeWood: (total: number) => void;
    setWardrobeAccessories: (total: number) => void;
    setSolution: (total: solutionObject) => void
}

// Create a Zustand store with typed state and actions
const useTotalSumStore = create<TotalSumState & TotalSumActions>((set) => ({
    kitchenWood: 0,
    kitchenAccessories: 0,
    wardrobeWood: 0,
    wardrobeAccessories: 0,
    solution: { withGst: 0, withoutGst: 0, discountTotal: 0, handlingFee: 0 },
    setKitchenWood: (total: number) => set({ kitchenWood: total }),
    setKitchenAccessory: (total: number) => set({ kitchenAccessories: total }),
    setWardrobeWood: (total: number) => set({ wardrobeWood: total }),
    setWardrobeAccessories: (total: number) => set({ wardrobeAccessories: total }),
    setSolution: (total: solutionObject) => set({ solution: total })
}));

export default useTotalSumStore;
