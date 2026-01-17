import { create } from "zustand";

interface Verify_phoneModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useVerify_phoneModal = create<Verify_phoneModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useVerify_phoneModal;
