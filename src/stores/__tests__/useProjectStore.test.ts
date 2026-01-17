import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProjectStore } from '../useProjectStore'
import { ProjectStatus } from '@/types/project'
import type { Project } from '@/types/project'

// 模拟 storage 模块
vi.mock('@/utils/storage', () => ({
  STORAGE_KEYS: {
    PROJECTS: 'team-expense-tracker:projects'
  },
  storage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn()
  }
}))

import { storage } from '@/utils/storage'

describe('useProjectStore', () => {
  // 每次测试前重置存储状态
  beforeEach(() => {
    useProjectStore.setState({
      projects: [],
      currentProjectId: null
    })
    vi.clearAllMocks()
  })

  it('应加载存储的项目', () => {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: '测试项目',
        description: '测试描述',
        status: ProjectStatus.ACTIVE,
        createdAt: 1234567890,
        updatedAt: 1234567890
      }
    ]

    // 模拟 storage.get 返回数据
    vi.mocked(storage.get).mockReturnValue(mockProjects)

    const store = useProjectStore.getState()
    store.loadProjects()

    expect(storage.get).toHaveBeenCalledWith('team-expense-tracker:projects')
    expect(useProjectStore.getState().projects).toEqual(mockProjects)
  })

  it('应添加新项目', () => {
    const store = useProjectStore.getState()

    const newProjectData = {
      name: '新项目',
      description: '新项目描述'
    }

    store.addProject(newProjectData)

    const projects = useProjectStore.getState().projects
    expect(projects).toHaveLength(1)
    expect(projects[0]).toMatchObject({
      name: '新项目',
      description: '新项目描述',
      status: ProjectStatus.ACTIVE
    })
    expect(projects[0].id).toBeDefined()
    expect(projects[0].createdAt).toBeDefined()
    expect(projects[0].updatedAt).toBeDefined()

    // 应调用 storage.set 保存数据
    expect(storage.set).toHaveBeenCalledWith('team-expense-tracker:projects', projects)
  })

  it('应更新现有项目', () => {
    const initialProjects: Project[] = [
      {
        id: '1',
        name: '旧名称',
        description: '旧描述',
        status: ProjectStatus.ACTIVE,
        createdAt: 1234567890,
        updatedAt: 1234567890
      }
    ]

    useProjectStore.setState({ projects: initialProjects })

    const store = useProjectStore.getState()
    store.updateProject('1', { name: '新名称', description: '新描述' })

    const projects = useProjectStore.getState().projects
    expect(projects).toHaveLength(1)
    expect(projects[0]).toMatchObject({
      id: '1',
      name: '新名称',
      description: '新描述',
      status: ProjectStatus.ACTIVE
    })
    expect(projects[0].updatedAt).toBeGreaterThan(1234567890)

    expect(storage.set).toHaveBeenCalledWith('team-expense-tracker:projects', projects)
  })

  it('应完成项目', () => {
    const initialProjects: Project[] = [
      {
        id: '1',
        name: '进行中项目',
        description: '描述',
        status: ProjectStatus.ACTIVE,
        createdAt: 1234567890,
        updatedAt: 1234567890
      }
    ]

    useProjectStore.setState({ projects: initialProjects })

    const store = useProjectStore.getState()
    store.completeProject('1')

    const projects = useProjectStore.getState().projects
    expect(projects[0].status).toBe(ProjectStatus.COMPLETED)
    expect(projects[0].completedAt).toBeDefined()
    expect(projects[0].updatedAt).toBeGreaterThan(1234567890)

    expect(storage.set).toHaveBeenCalledWith('team-expense-tracker:projects', projects)
  })

  it('应删除项目', () => {
    const initialProjects: Project[] = [
      {
        id: '1',
        name: '项目1',
        description: '描述1',
        status: ProjectStatus.ACTIVE,
        createdAt: 1234567890,
        updatedAt: 1234567890
      },
      {
        id: '2',
        name: '项目2',
        description: '描述2',
        status: ProjectStatus.ACTIVE,
        createdAt: 1234567890,
        updatedAt: 1234567890
      }
    ]

    useProjectStore.setState({ projects: initialProjects })

    const store = useProjectStore.getState()
    store.deleteProject('1')

    const projects = useProjectStore.getState().projects
    expect(projects).toHaveLength(1)
    expect(projects[0].id).toBe('2')

    expect(storage.set).toHaveBeenCalledWith('team-expense-tracker:projects', projects)
  })

  it('应设置和获取当前项目', () => {
    const store = useProjectStore.getState()

    // 设置当前项目
    store.setCurrentProject('123')
    expect(useProjectStore.getState().currentProjectId).toBe('123')

    // 清除当前项目
    store.setCurrentProject(null)
    expect(useProjectStore.getState().currentProjectId).toBeNull()
  })

  it('应通过 ID 获取项目', () => {
    const initialProjects: Project[] = [
      {
        id: '1',
        name: '项目1',
        description: '描述1',
        status: ProjectStatus.ACTIVE,
        createdAt: 1234567890,
        updatedAt: 1234567890
      },
      {
        id: '2',
        name: '项目2',
        description: '描述2',
        status: ProjectStatus.ACTIVE,
        createdAt: 1234567890,
        updatedAt: 1234567890
      }
    ]

    useProjectStore.setState({ projects: initialProjects })

    const store = useProjectStore.getState()
    const project1 = store.getProjectById('1')
    const project2 = store.getProjectById('2')
    const project3 = store.getProjectById('3') // 不存在

    expect(project1?.name).toBe('项目1')
    expect(project2?.name).toBe('项目2')
    expect(project3).toBeUndefined()
  })

  it('应获取当前选中的项目', () => {
    const initialProjects: Project[] = [
      {
        id: '1',
        name: '项目1',
        description: '描述1',
        status: ProjectStatus.ACTIVE,
        createdAt: 1234567890,
        updatedAt: 1234567890
      },
      {
        id: '2',
        name: '项目2',
        description: '描述2',
        status: ProjectStatus.ACTIVE,
        createdAt: 1234567890,
        updatedAt: 1234567890
      }
    ]

    useProjectStore.setState({
      projects: initialProjects,
      currentProjectId: '2'
    })

    const store = useProjectStore.getState()
    const currentProject = store.getCurrentProject()

    expect(currentProject?.name).toBe('项目2')
  })

  it('当没有当前项目时应返回 undefined', () => {
    const store = useProjectStore.getState()
    const currentProject = store.getCurrentProject()

    expect(currentProject).toBeUndefined()
  })
})