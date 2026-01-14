import { useState } from 'react'
import { useMemberStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Plus, Trash2, Edit } from 'lucide-react'

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
      setEditingId(null)
    } else {
      addMember(formData)
    }

    setFormData({ name: '', avatar: '👨' })
    setShowForm(false)
  }

  const handleEdit = (member: typeof members[0]) => {
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">成员管理</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加成员
        </Button>
      </div>

      {/* 添加/编辑成员表单 */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? '编辑成员' : '添加成员'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="例如：张三"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  头像 (选择一个 emoji)
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {EMOJI_OPTIONS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: emoji }))}
                      className={`text-3xl p-3 rounded-lg border-2 transition-all ${
                        formData.avatar === emoji
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  取消
                </Button>
                <Button onClick={handleSubmit}>
                  {editingId ? '更新' : '添加'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 成员列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map(member => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{member.avatar}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-xs text-gray-500">
                      ID: {member.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(member.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          暂无成员，点击"添加成员"开始吧！
        </div>
      )}
    </div>
  )
}
