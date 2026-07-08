"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LocationData {
  city: string;
  street: string;
  houseNo: string;
}

interface LocationDialogProps {
  toggleDialog: () => void;
  dialogStatus: boolean;
  handleCheckOut: (type: "save_cart" | "process_checkout") => void;
  handleCheckLoading: () => void;
}

export default function LocationDialog({
  toggleDialog,
  dialogStatus,
  handleCheckOut,
  handleCheckLoading,
}: LocationDialogProps) {
  //   const [open, setOpen] = useState(false);
  const [form, setForm] = useState<LocationData>({
    city: "",
    street: "",
    houseNo: "",
  });
  const [errors, setErrors] = useState<Partial<LocationData>>({});

  const handleChange = (field: keyof LocationData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors: Partial<LocationData> = {};
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.street.trim()) nextErrors.street = "Street is required";
    if (!form.houseNo.trim()) nextErrors.houseNo = "House no. is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCancel = () => {
    setForm({ city: "", street: "", houseNo: "" });
    setErrors({});
    toggleDialog();
  };

  const handleProceed = () => {
    if (!validate()) return;
    handleCheckLoading();
    handleCheckOut("process_checkout");
    toggleDialog();
  };

  return (
    <Dialog open={dialogStatus} onOpenChange={toggleDialog}>
      <DialogContent className="bg-amber-50 border-none sm:max-w-md p-8">
        <DialogHeader>
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🌿</span>
              <span className="text-lg font-bold text-green-700 tracking-wider">
                FRESHMART
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Confirm your delivery address
            </p>
          </div>
          <DialogTitle className="sr-only">Delivery Address</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProceed();
          }}
          className="flex flex-col gap-5"
        >
          {/* City */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="city" className="text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              placeholder="enter your city..."
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            {errors.city && (
              <p className="text-red-500 text-xs">{errors.city}</p>
            )}
          </div>

          {/* Street */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="street"
              className="text-sm font-medium text-gray-700"
            >
              Street
            </label>
            <input
              type="text"
              id="street"
              placeholder="enter your street..."
              value={form.street}
              onChange={(e) => handleChange("street", e.target.value)}
              className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            {errors.street && (
              <p className="text-red-500 text-xs">{errors.street}</p>
            )}
          </div>

          {/* House No */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="houseNo"
              className="text-sm font-medium text-gray-700"
            >
              House No.
            </label>
            <input
              type="text"
              id="houseNo"
              placeholder="enter your house number..."
              value={form.houseNo}
              onChange={(e) => handleChange("houseNo", e.target.value)}
              className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            {errors.houseNo && (
              <p className="text-red-500 text-xs">{errors.houseNo}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full border border-gray-300 hover:bg-gray-100 active:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-sm transition-colors duration-200"
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
