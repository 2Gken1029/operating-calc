"use client";
import { useState } from "react";
import CSVReader from "./CSVReader";

export default function CSVDataTable() {
  // CSVファイルの内容を格納する用のstate
  const [uploadedList, setUploadedList] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<any[]>([]);

  //　CSVファイルをアップロードした時の処理
  const handleUploadCsv = (data: any) => {
    const _formattedData = data
      .map((d: any) => {
        return {
          date: d[2], // 工数登録日
          project: d[3], // プロジェクト名
          minutes: d[6], // 工数実績（分）
        };
      })
      .filter((d: any) => d != null);

    setUploadedList(_formattedData);

    // プロジェクト総数の計算
    const sumByProject: { [key: string]: number } = {};

    _formattedData.forEach((item: { project: string; minutes?: string }) => {
      const { project, minutes } = item;
      if (minutes !== undefined) {
        if (!sumByProject[project]) {
          sumByProject[project] = 0;
        }
        sumByProject[project] += parseInt(minutes);
      }
    });

    for (const [key, value] of Object.entries(sumByProject)) {
      const formattedTime = convertToHoursAndMinutes(value);
      setProjectData((prevData) => [
        ...prevData,
        { project: key, totalHours: value, formattedTime: formattedTime },
      ]);
    }
  };

  const convertToHoursAndMinutes: any = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`;
  };

  return (
    <>
      <div className="p-10">
        <div className="py-4 text-gray-600 dark:text-white">
          <CSVReader setUploadedData={handleUploadCsv} />
        </div>
        <div className="py-4 text-gray-600 dark:text-white">
          {projectData.length > 0 ? (
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      プロジェクト名
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      工数実績総数（h:mm）
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectData.map((d: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{d.project}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {d.totalHours}（{d.formattedTime}）
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
        <div className="py-4 text-gray-600 dark:text-white">
          {uploadedList.length > 0 ? (
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      日付
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      プロジェクト名
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      工数実績（分）
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploadedList.map((d: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{d.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{d.project}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{d.minutes}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
