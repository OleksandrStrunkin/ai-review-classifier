import React, { useState } from "react";

/**
 * Компонент для завантаження файлу CSV та запуску аналізу.
 * @param {object} props
 * @param {function} props.onAnalyze - Функція, яка викликається при натисканні 'Запустити аналіз'.
 * @param {boolean} props.isLoading - Індикатор, чи триває аналіз.
 */
export default function UploadArea({ onAnalyze, isLoading }) {
  // Стан для зберігання вибраного файлу
  const [selectedFile, setSelectedFile] = useState(null);

  // Обробник зміни в інпуті файлу
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      alert("Будь ласка, завантажте файл у форматі .csv.");
    }
  };

  // Обробник натискання кнопки
  const handleSubmit = () => {
    if (selectedFile) {
      // Викликаємо функцію, передану з батьківського компонента (Home)
      onAnalyze(selectedFile);
    } else {
      alert("Спочатку оберіть CSV-файл!");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-4">
      {/* 1. Поле для завантаження файлу */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Виберіть CSV-файл із відгуками
      </label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-150 file:text-indigo-900
                    hover:file:bg-indigo-400/50 dark:file:bg-indigo-900
                    dark:file:text-indigo-300 file:duration-300 cursor-pointer
                    file:cursor-pointer
                "
      />

      {/* 2. Індикатор вибраного файлу */}
      {selectedFile && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          **Вибрано:** {selectedFile.name} (
          {Math.round(selectedFile.size / 1024)} KB)
        </p>
      )}

      {/* 3. Кнопка для запуску аналізу */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading}
        className={`w-full py-3 px-4 mt-4 font-bold rounded-lg shadow-md transition-all duration-200 
                    ${
                      selectedFile && !isLoading
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                    }
                `}
      >
        {/* Відображення тексту залежно від стану */}
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
    </div>
  );
}
