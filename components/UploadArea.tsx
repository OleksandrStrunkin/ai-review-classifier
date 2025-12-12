import { useState } from "react";
import { UploadAreaProps } from "@/types/analysis";

export default function UploadArea({
  onAnalyze,
  isLoading,
  onShowExample,
}: UploadAreaProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      alert("Будь ласка, завантажте файл у форматі .csv.");
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    } else {
      alert("Спочатку оберіть CSV-файл!");
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl shadow-gray-900/50 border border-gray-700 space-y-5">
      <div className="border border-dashed border-gray-600 rounded-lg p-5 text-center transition-colors duration-200 hover:border-indigo-400">
        <label className="block text-sm font-medium text-gray-300 cursor-pointer">
          <span className="mb-2 block">Виберіть CSV-файл із відгуками</span>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="inline-flex items-center justify-center px-4 py-2 bg-indigo-900/50 border border-indigo-700 text-sm font-medium rounded-full text-indigo-300 hover:bg-indigo-900 transition-colors duration-200">
            {selectedFile ? "Файл вибрано (Змінити)" : "Обрати файл (.csv)"}
          </div>
        </label>
      </div>
      {selectedFile && (
        <p className="mt-2 text-sm text-gray-400">
          **Вибрано:** **{selectedFile.name}** (
          {Math.round(selectedFile.size / 1024)} KB)
        </p>
      )}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading}
        className={`w-full py-3 px-4 font-bold rounded-lg transition-all duration-300 
                            shadow-lg 
                            ${
                              selectedFile && !isLoading
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/50"
                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                            }
                        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Аналізуємо...
          </span>
        ) : (
          "Запустити аналіз"
        )}
      </button>
      <div className="text-center text-gray-600 text-sm py-1">— або —</div>
      <button
        onClick={onShowExample}
        disabled={isLoading}
        className="w-full py-3 bg-gray-700 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition duration-300 disabled:opacity-70 cursor-pointer"
      >
        {isLoading ? "Завантаження прикладу..." : "Показати приклад без API"}
      </button>
    </div>
  );
}
