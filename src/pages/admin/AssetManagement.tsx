import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AssetList } from '../../components/admin/assets/AssetList';
import { AssetUpload } from '../../components/admin/assets/AssetUpload';
import { AssetCategories } from '../../components/admin/assets/AssetCategories';

export function AssetManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
      </div>

      <AssetCategories />

      <Routes>
        <Route path="/" element={<AssetList />} />
        <Route path="/upload" element={<AssetUpload />} />
      </Routes>
    </div>
  );
}