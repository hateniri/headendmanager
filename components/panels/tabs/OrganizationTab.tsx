'use client'

import React, { useState } from 'react'
import { useFacilityStore } from '@/store/facilityStore'
import { Organization } from '@/types'

export default function OrganizationTab() {
  const selectedFacilityOrganization = useFacilityStore((state) => state.selectedFacilityOrganization)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['org-root']))

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const renderOrganizationNode = (org: Organization, level: number = 0) => {
    const hasChildren = org.children && org.children.length > 0
    const isExpanded = expandedNodes.has(org.id)
    
    return (
      <div key={org.id} className="select-none">
        <div
          className={`flex items-start py-2 px-3 hover:bg-gray-50 cursor-pointer rounded transition-colors`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
          onClick={() => hasChildren && toggleNode(org.id)}
        >
          {hasChildren && (
            <span className="mr-2 text-gray-400 flex-shrink-0 mt-1">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {!hasChildren && (
            <span className="mr-2 text-gray-300 flex-shrink-0 mt-1">•</span>
          )}
          
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-gray-900">{org.name}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {org.position}
              </span>
            </div>
            {(org.email || org.phone) && (
              <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                {org.email && (
                  <div>
                    <span className="text-gray-400">✉</span> {org.email}
                  </div>
                )}
                {org.phone && (
                  <div>
                    <span className="text-gray-400">☎</span> {org.phone}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {org.children!.map(child => renderOrganizationNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (!selectedFacilityOrganization) {
    return (
      <div className="p-4">
        <p className="text-gray-500">組織情報を読み込んでいます...</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">管理体制</h3>
        <p className="text-sm text-gray-600">
          施設の管理組織構成
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-2">
        {renderOrganizationNode(selectedFacilityOrganization)}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">緊急連絡先</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">24時間監視センター:</span>
            <span className="font-medium text-blue-900">0120-XXX-XXX</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">セキュリティホットライン:</span>
            <span className="font-medium text-blue-900">0120-YYY-YYY</span>
          </div>
        </div>
      </div>
    </div>
  )
}