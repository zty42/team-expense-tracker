import { useState } from 'react'
import { FolderKanban, Lock, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { ModalSheet } from '@/components/ui/modal-sheet'
import { PageHero } from '@/components/ui/page-hero'
import { useCategoryStore } from '@/stores'

const EMOJI_OPTIONS = ['🍜', '🚗', '🏨', '🎮', '🛍️', '📝', '🎬', '🏋️', '✈️', '🎵', '📚', '💊']
const COLOR_OPTIONS = [
  { name: '珊瑚橙', value: '#D56A3A' },
  { name: '薄荷绿', value: '#7FC3A5' },
  { name: '湖水蓝', value: '#6CB8D9' },
  { name: '暖粉色', value: '#D982A6' },
  { name: '琥珀黄', value: '#D9B87C' },
  { name: '烟紫灰', value: '#A4899B' }
]

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory } = useCategoryStore()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    icon: '📝',
    color: '#D56A3A'
  })

  const presetCategories = categories.filter((category) => !category.isCustom)
  const customCategories = categories.filter((category) => category.isCustom)

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('请输入分类名称')
      return
    }

    addCategory(formData)
    setFormData({ name: '', icon: '📝', color: '#D56A3A' })
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

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Categories"
        title="分类管理"
        description="消费分类决定了图表颜色、账单标签和整体识别效率。预置分类保持稳定，自定义分类负责补充你的真实场景。"
        actions={(
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            添加自定义分类
          </Button>
        )}
        stats={[
          {
            label: '预置分类',
            value: presetCategories.length,
            description: '系统默认提供的基础分类',
            icon: Lock,
            tone: 'sage'
          },
          {
            label: '自定义分类',
            value: customCategories.length,
            description: '用于补充团队自己的消费语义',
            icon: FolderKanban,
            tone: 'warm'
          }
        ]}
      />

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              预置分类
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              这些分类由系统提供，适合作为团队记账的稳定基础。
            </p>
          </div>
          <span className="app-badge bg-white/80 text-muted-foreground shadow-sm">
            不可删除
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {presetCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardContent className="p-4 text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] text-4xl shadow-sm"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {category.icon}
                </div>
                <div className="mt-4 font-semibold text-foreground">{category.name}</div>
                <div className="mx-auto mt-4 h-2 w-16 rounded-full" style={{ backgroundColor: category.color }} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              自定义分类
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              用来覆盖团队自己的活动场景，比如团建、医疗或办公采购。
            </p>
          </div>
          <span className="app-badge bg-orange-100 text-orange-950">
            可自由维护
          </span>
        </div>

        {customCategories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {customCategories.map((category) => (
              <Card key={category.id} className="relative overflow-hidden">
                <CardContent className="p-4 text-center">
                  <div
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] text-4xl shadow-sm"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div className="mt-4 font-semibold text-foreground">{category.name}</div>
                  <div className="mx-auto mt-4 h-2 w-16 rounded-full" style={{ backgroundColor: category.color }} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-3"
                    onClick={() => handleDelete(category.id, category.isCustom)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="🏷️"
            title="还没有自定义分类"
            description="当预置分类不够用时，再补一个更贴近你们消费场景的分类。"
            action={(
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" />
                添加第一个自定义分类
              </Button>
            )}
          />
        )}
      </section>

      <ModalSheet
        open={showForm}
        onOpenChange={setShowForm}
        title="添加自定义分类"
        description="图标和颜色会直接影响账单标签与统计图表，建议保持醒目且彼此易区分。"
      >
        <div className="space-y-5">
          <div>
            <label className="app-field-label">分类名称</label>
            <Input
              value={formData.name}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="例如：医疗、办公、摄影"
            />
          </div>

          <div>
            <label className="app-field-label">图标 emoji</label>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {EMOJI_OPTIONS.map((emoji) => {
                const isSelected = formData.icon === emoji

                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, icon: emoji }))}
                    className={`rounded-[22px] border p-3 text-3xl transition-all ${
                      isSelected
                        ? 'border-primary/40 bg-orange-50 shadow-[0_12px_24px_rgba(213,106,58,0.12)]'
                        : 'border-border/80 bg-white/80 hover:bg-white'
                    }`}
                  >
                    {emoji}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="app-field-label">图表颜色</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {COLOR_OPTIONS.map((color) => {
                const isSelected = formData.color === color.value

                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                    className={`rounded-[22px] border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-primary/40 bg-orange-50 shadow-[0_12px_24px_rgba(213,106,58,0.12)]'
                        : 'border-border/80 bg-white/80 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {color.name}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>确认添加</Button>
          </div>
        </div>
      </ModalSheet>
    </div>
  )
}
