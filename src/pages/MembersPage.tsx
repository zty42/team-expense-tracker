import { useState } from 'react'
import { Edit3, Plus, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { ModalSheet } from '@/components/ui/modal-sheet'
import { PageHero } from '@/components/ui/page-hero'
import { useMemberStore } from '@/stores'
import type { Member } from '@/types/member'

const EMOJI_OPTIONS = ['👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💼', '👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨‍🔧', '👩‍🔧', '🧑‍🔧']

export default function MembersPage() {
  const { members, addMember, updateMember, deleteMember } = useMemberStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    avatar: '👨'
  })

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('请输入成员姓名')
      return
    }

    if (editingId) {
      updateMember(editingId, formData)
    } else {
      addMember(formData)
    }

    setFormData({ name: '', avatar: '👨' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (member: Member) => {
    setFormData({
      name: member.name,
      avatar: member.avatar || '👨'
    })
    setEditingId(member.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setFormData({ name: '', avatar: '👨' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个成员吗？如果该成员有关联账单，建议不要删除。')) {
      deleteMember(id)
    }
  }

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Members"
        title="成员管理"
        description="统一成员头像和姓名后，账单录入、图表展示和结算方案都会更清楚。"
        actions={(
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            添加成员
          </Button>
        )}
        stats={[
          {
            label: '成员总数',
            value: members.length,
            description: '当前本地工作台可直接参与记账的成员',
            icon: Users,
            tone: 'warm'
          }
        ]}
      />

      {members.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-orange-100 to-amber-50 text-4xl shadow-sm">
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        成员 ID: {member.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                <div className="mt-5 rounded-[22px] bg-white/75 p-4 text-sm leading-7 text-muted-foreground">
                  这个成员可以被选作账单付款人，也可以作为消费参与者进入后续的均摊与结算流程。
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          emoji="🧑‍🤝‍🧑"
          title="还没有成员"
          description="先把团队成员录入进来，项目创建和账单分摊才会更顺手。"
          action={(
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              添加第一位成员
            </Button>
          )}
        />
      )}

      <ModalSheet
        open={showForm}
        onOpenChange={(open) => {
          if (!open) handleCancel()
          else setShowForm(true)
        }}
        title={editingId ? '编辑成员' : '添加成员'}
        description="成员头像会作为各页面的核心识别元素，建议选择容易分辨的 emoji。"
      >
        <div className="space-y-5">
          <div>
            <label className="app-field-label">姓名</label>
            <Input
              value={formData.name}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="例如：张三"
            />
          </div>

          <div>
            <label className="app-field-label">头像 emoji</label>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {EMOJI_OPTIONS.map((emoji) => {
                const isSelected = formData.avatar === emoji

                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, avatar: emoji }))}
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

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button onClick={handleSubmit}>{editingId ? '更新成员' : '确认添加'}</Button>
          </div>
        </div>
      </ModalSheet>
    </div>
  )
}
