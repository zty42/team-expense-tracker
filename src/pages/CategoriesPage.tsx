import { useState } from 'react'
import { useCategoryStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Plus, Trash2, Lock } from 'lucide-react'

const EMOJI_OPTIONS = ['🍜', '🚗', '🏨', '🎮', '🛍️', '📝', '🎬', '🏋️', '✈️', '🎵', '📚', '💊']
const COLOR_OPTIONS = [
  { name: '红色', value: '#FF6B6B' },
  { name: '蓝色', value: '#4ECDC4' },
  { name: '绿色', value: '#96CEB4' },
  { name: '黄色', value: '#FFEAA7' },
  { name: '紫色', value: '#A29BFE' },
  { name: '橙色', value: '#FD79A8' }
]

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory } = useCategoryStore()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    icon: '📝',
    color: '#FF6B6B'
  })

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('请输入分类名称')
      return
    }

    addCategory(formData)

    setFormData({ name: '', icon: '📝', color: '#FF6B6B' })
    setShowForm(false)
  }

  const handleDelete = (id: string, isCustom: boolean) => {
    if (!isCustom) {
      alert('预置分类不能删除')
      return
    }

    if (confirm('确定要删除这个分类吗？如果有账单使用此分类，建议不要删除。')) {
      deleteCategory(id)
    }
  }

  const presetCategories = categories.filter(c => !c.isCustom)
  const customCategories = categories.filter(c => c.isCustom)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">分类管理</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加自定义分类
        </Button>
      </div>

      {/* 添加分类表单 */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>添加自定义分类</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分类名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="例如：医疗"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图标 (选择一个 emoji)
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {EMOJI_OPTIONS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                      className={`text-3xl p-3 rounded-lg border-2 transition-all ${
                        formData.icon === emoji
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  颜色 (用于图表显示)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_OPTIONS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                        formData.color === color.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-sm">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  取消
                </Button>
                <Button onClick={handleSubmit}>添加</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 预置分类 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-gray-500" />
          预置分类 ({presetCategories.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {presetCategories.map(category => (
            <Card key={category.id}>
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{category.icon}</div>
                <div className="font-semibold text-gray-900">{category.name}</div>
                <div
                  className="w-12 h-2 rounded-full mx-auto mt-2"
                  style={{ backgroundColor: category.color }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 自定义分类 */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          自定义分类 ({customCategories.length})
        </h3>
        {customCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {customCategories.map(category => (
              <Card key={category.id} className="relative group">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-gray-900">{category.name}</div>
                  <div
                    className="w-12 h-2 rounded-full mx-auto mt-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(category.id, category.isCustom)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            暂无自定义分类，点击"添加自定义分类"开始吧！
          </div>
        )}
      </div>
    </div>
  )
}
