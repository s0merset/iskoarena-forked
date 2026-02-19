"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({ isOpen, title, message, onConfirm, onCancel }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-xl w-[90%] max-w-[400px] p-8 shadow-2xl relative">
        <button
          className="absolute top-4 right-4 text-3xl font-bold text-gray-400 hover:text-black leading-none"
          onClick={onCancel}
        >
          &times;
        </button>
        <h2 className="text-[#A91D3A] text-xl font-bold mb-3">{title}</h2>
        <p className="text-black mb-6 text-sm">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-all"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
