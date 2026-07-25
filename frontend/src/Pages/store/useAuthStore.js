import { create } from "zustand";
import { axiosInstanace } from "../../components/lib/axios";
export const useAuthStore = create((set)=>({
    authUser : null,
    isSigningUp: false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,

    isCheckingAuth:true,
    checkAuth: async() => {
        try {
            const res = await axiosInstanace.get("/auth/check")
            set({authUser:res.data})
        } catch (error){
            set({authUser:null});
        } finally {
            set({isCheckingAuth:false});
        }
    },
}));