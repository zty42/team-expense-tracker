export interface Category {
  id: string;
  name: string;
  icon?: string; // emoji
  color?: string; // 图表颜色
  isCustom: boolean;
  createdAt: number;
}
