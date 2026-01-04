/**
 * 教學管理器
 * 管理教學內容、進度追蹤和個人化推薦
 */

import { Tutorial, CalculatorType } from '@/components/tutorial/TutorialSystem';

export interface TutorialProgress {
  tutorialId: string;
  completedSteps: number[];
  completedAt?: Date;
  timeSpent: number; // 秒
  rating?: number; // 1-5 星評分
  feedback?: string;
}

export interface UserTutorialProfile {
  userId?: string;
  completedTutorials: string[];
  inProgressTutorials: Record<string, TutorialProgress>;
  preferences: {
    autoPlay: boolean;
    showHints: boolean;
    playbackSpeed: number;
    preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
  };
  skillLevel: Record<CalculatorType, number>; // 0-100
}

/**
 * 教學管理器類
 */
export class TutorialManager {
  private tutorials: Map<string, Tutorial> = new Map();
  private userProfile: UserTutorialProfile;
  private storageKey = 'taicalc_tutorial_profile';

  constructor() {
    this.userProfile = this.loadUserProfile();
    this.initializeDefaultTutorials();
  }

  /**
   * 載入用戶教學檔案
   */
  private loadUserProfile(): UserTutorialProfile {
    // 檢查是否在瀏覽器環境
    if (typeof window === 'undefined') {
      return this.getDefaultProfile();
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('載入教學檔案失敗:', error);
    }

    return this.getDefaultProfile();
  }

  /**
   * 獲取預設檔案
   */
  private getDefaultProfile(): UserTutorialProfile {
    return {
      completedTutorials: [],
      inProgressTutorials: {},
      preferences: {
        autoPlay: false,
        showHints: true,
        playbackSpeed: 1,
        preferredDifficulty: 'beginner'
      },
      skillLevel: {
        salary: 0,
        tax: 0,
        mortgage: 0,
        capital: 0,
        general: 0
      }
    };
  }

  /**
   * 保存用戶教學檔案
   */
  private saveUserProfile(): void {
    // 檢查是否在瀏覽器環境
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.userProfile));
    } catch (error) {
      console.error('保存教學檔案失敗:', error);
    }
  }

  /**
   * 初始化預設教學內容
   */
  private initializeDefaultTutorials(): void {
    // 薪資計算器教學
    this.addTutorial({
      id: 'salary-basic',
      title: '薪資計算器基礎教學',
      description: '學習如何使用薪資計算器計算實際薪資、勞健保和稅額',
      calculatorType: 'salary',
      estimatedTime: 5,
      difficulty: 'beginner',
      steps: [
        {
          id: 'welcome',
          title: '歡迎使用薪資計算器',
          content: '這個教學將帶您了解如何使用薪資計算器。我們會逐步介紹各個功能。',
          position: 'center',
          duration: 3000,
          skippable: true
        },
        {
          id: 'input-salary',
          title: '輸入月薪',
          content: '首先，請在這裡輸入您的月薪金額。這是計算的基礎數據。',
          target: 'input[name="monthlySalary"]',
          position: 'bottom',
          action: 'input',
          actionTarget: 'input[name="monthlySalary"]',
          actionValue: '50000',
          highlight: true
        },
        {
          id: 'select-year',
          title: '選擇年度',
          content: '選擇要計算的年度，不同年度的勞健保費率可能不同。',
          target: 'select[name="year"]',
          position: 'bottom',
          action: 'click',
          actionTarget: 'select[name="year"]'
        },
        {
          id: 'calculate',
          title: '開始計算',
          content: '點擊計算按鈕來獲得詳細的薪資分析結果。',
          target: 'button[type="submit"]',
          position: 'top',
          action: 'click',
          actionTarget: 'button[type="submit"]',
          highlight: true
        },
        {
          id: 'view-results',
          title: '查看結果',
          content: '計算完成！您可以看到實際薪資、各項扣除額和稅額的詳細分析。',
          target: '.calculation-results',
          position: 'top',
          duration: 5000
        }
      ]
    });

    // 房貸計算器教學
    this.addTutorial({
      id: 'mortgage-basic',
      title: '房貸計算器基礎教學',
      description: '學習如何計算房貸月付金、總利息和還款計劃',
      calculatorType: 'mortgage',
      estimatedTime: 7,
      difficulty: 'beginner',
      steps: [
        {
          id: 'welcome',
          title: '歡迎使用房貸計算器',
          content: '這個教學將教您如何使用房貸計算器規劃您的購屋計劃。',
          position: 'center',
          duration: 3000
        },
        {
          id: 'input-price',
          title: '輸入房屋總價',
          content: '請輸入您想購買的房屋總價。',
          target: 'input[name="housePrice"]',
          position: 'bottom',
          action: 'input',
          actionTarget: 'input[name="housePrice"]',
          actionValue: '8000000'
        },
        {
          id: 'input-downpayment',
          title: '設定頭期款',
          content: '輸入您準備的頭期款金額或比例。',
          target: 'input[name="downPayment"]',
          position: 'bottom',
          action: 'input',
          actionTarget: 'input[name="downPayment"]',
          actionValue: '1600000'
        },
        {
          id: 'set-interest-rate',
          title: '設定利率',
          content: '輸入銀行提供的房貸利率。',
          target: 'input[name="interestRate"]',
          position: 'bottom',
          action: 'input',
          actionTarget: 'input[name="interestRate"]',
          actionValue: '2.1'
        },
        {
          id: 'set-loan-term',
          title: '選擇貸款年限',
          content: '選擇您的房貸還款年限。',
          target: 'select[name="loanTerm"]',
          position: 'bottom',
          action: 'click',
          actionTarget: 'select[name="loanTerm"]'
        },
        {
          id: 'calculate-mortgage',
          title: '計算房貸',
          content: '點擊計算按鈕來獲得詳細的房貸分析。',
          target: 'button[type="submit"]',
          position: 'top',
          action: 'click',
          actionTarget: 'button[type="submit"]'
        },
        {
          id: 'analyze-results',
          title: '分析結果',
          content: '查看月付金、總利息和還款計劃。您還可以查看圖表分析。',
          target: '.mortgage-results',
          position: 'top',
          duration: 6000
        }
      ]
    });

    // 稅務計算器教學
    this.addTutorial({
      id: 'tax-basic',
      title: '稅務計算器基礎教學',
      description: '學習如何計算個人綜合所得稅',
      calculatorType: 'tax',
      estimatedTime: 6,
      difficulty: 'intermediate',
      prerequisites: ['salary-basic'],
      steps: [
        {
          id: 'welcome',
          title: '歡迎使用稅務計算器',
          content: '這個教學將教您如何計算個人綜合所得稅，幫助您做好稅務規劃。',
          position: 'center',
          duration: 3000
        },
        {
          id: 'input-income',
          title: '輸入年收入',
          content: '請輸入您的年度總收入，包括薪資、獎金等。',
          target: 'input[name="annualIncome"]',
          position: 'bottom',
          action: 'input',
          actionTarget: 'input[name="annualIncome"]',
          actionValue: '600000'
        },
        {
          id: 'set-deductions',
          title: '設定扣除額',
          content: '選擇適用的扣除額項目，如標準扣除額或列舉扣除額。',
          target: '.deduction-options',
          position: 'right',
          interactive: true
        },
        {
          id: 'family-status',
          title: '家庭狀況',
          content: '設定您的婚姻狀況和扶養親屬數量。',
          target: '.family-status',
          position: 'bottom',
          interactive: true
        },
        {
          id: 'calculate-tax',
          title: '計算稅額',
          content: '點擊計算按鈕來獲得詳細的稅額分析。',
          target: 'button[type="submit"]',
          position: 'top',
          action: 'click',
          actionTarget: 'button[type="submit"]'
        },
        {
          id: 'tax-planning',
          title: '稅務規劃建議',
          content: '查看計算結果和稅務規劃建議，了解如何合法節稅。',
          target: '.tax-results',
          position: 'top',
          duration: 8000
        }
      ]
    });

    // 通用功能教學
    this.addTutorial({
      id: 'general-features',
      title: 'TaiCalc 功能導覽',
      description: '了解 TaiCalc 的各項功能和特色',
      calculatorType: 'general',
      estimatedTime: 4,
      difficulty: 'beginner',
      steps: [
        {
          id: 'navigation',
          title: '導航選單',
          content: '使用頂部導航選單可以快速切換不同的計算器。',
          target: 'nav',
          position: 'bottom',
          duration: 3000
        },
        {
          id: 'ai-advisor',
          title: 'AI 財務顧問',
          content: '點擊 AI 顧問按鈕可以獲得個人化的財務建議。',
          target: '.ai-advisor-button',
          position: 'bottom',
          action: 'click',
          actionTarget: '.ai-advisor-button'
        },
        {
          id: 'save-results',
          title: '保存結果',
          content: '您可以保存計算結果以便日後查看和比較。',
          target: '.save-button',
          position: 'top',
          duration: 3000
        },
        {
          id: 'knowledge-base',
          title: '知識庫',
          content: '訪問知識庫可以學習更多財務知識和技巧。',
          target: 'a[href="/knowledge"]',
          position: 'bottom',
          duration: 3000
        }
      ]
    });
  }

  /**
   * 添加教學
   */
  addTutorial(tutorial: Tutorial): void {
    this.tutorials.set(tutorial.id, tutorial);
  }

  /**
   * 獲取教學
   */
  getTutorial(id: string): Tutorial | undefined {
    return this.tutorials.get(id);
  }

  /**
   * 獲取所有教學
   */
  getAllTutorials(): Tutorial[] {
    return Array.from(this.tutorials.values());
  }

  /**
   * 根據計算器類型獲取教學
   */
  getTutorialsByType(type: CalculatorType): Tutorial[] {
    return Array.from(this.tutorials.values())
      .filter(tutorial => tutorial.calculatorType === type);
  }

  /**
   * 獲取推薦教學
   */
  getRecommendedTutorials(limit: number = 3): Tutorial[] {
    const allTutorials = this.getAllTutorials();
    const { completedTutorials, preferences, skillLevel } = this.userProfile;

    // 過濾已完成的教學
    const availableTutorials = allTutorials.filter(
      tutorial => !completedTutorials.includes(tutorial.id)
    );

    // 根據難度偏好和技能等級排序
    const scored = availableTutorials.map(tutorial => {
      let score = 0;

      // 難度匹配
      if (tutorial.difficulty === preferences.preferredDifficulty) {
        score += 10;
      }

      // 技能等級匹配
      const userSkill = skillLevel[tutorial.calculatorType] || 0;
      if (tutorial.difficulty === 'beginner' && userSkill < 30) score += 8;
      if (tutorial.difficulty === 'intermediate' && userSkill >= 30 && userSkill < 70) score += 8;
      if (tutorial.difficulty === 'advanced' && userSkill >= 70) score += 8;

      // 先修課程檢查
      if (tutorial.prerequisites) {
        const hasPrerequisites = tutorial.prerequisites.every(
          prereq => completedTutorials.includes(prereq)
        );
        if (!hasPrerequisites) score -= 20;
      }

      return { tutorial, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.tutorial);
  }

  /**
   * 開始教學
   */
  startTutorial(tutorialId: string): void {
    if (!this.userProfile.inProgressTutorials[tutorialId]) {
      this.userProfile.inProgressTutorials[tutorialId] = {
        tutorialId,
        completedSteps: [],
        timeSpent: 0
      };
      this.saveUserProfile();
    }
  }

  /**
   * 更新教學進度
   */
  updateProgress(tutorialId: string, stepIndex: number, timeSpent: number): void {
    const progress = this.userProfile.inProgressTutorials[tutorialId];
    if (progress) {
      if (!progress.completedSteps.includes(stepIndex)) {
        progress.completedSteps.push(stepIndex);
      }
      progress.timeSpent += timeSpent;
      this.saveUserProfile();
    }
  }

  /**
   * 完成教學
   */
  completeTutorial(tutorialId: string, rating?: number, feedback?: string): void {
    const tutorial = this.getTutorial(tutorialId);
    if (!tutorial) return;

    // 移除進行中的教學
    const progress = this.userProfile.inProgressTutorials[tutorialId];
    if (progress) {
      progress.completedAt = new Date();
      progress.rating = rating;
      progress.feedback = feedback;
    }

    // 添加到已完成列表
    if (!this.userProfile.completedTutorials.includes(tutorialId)) {
      this.userProfile.completedTutorials.push(tutorialId);
    }

    // 更新技能等級
    const skillIncrease = tutorial.difficulty === 'beginner' ? 10 : 
                         tutorial.difficulty === 'intermediate' ? 15 : 20;
    this.userProfile.skillLevel[tutorial.calculatorType] = Math.min(
      100,
      (this.userProfile.skillLevel[tutorial.calculatorType] || 0) + skillIncrease
    );

    // 清理進行中的教學
    delete this.userProfile.inProgressTutorials[tutorialId];

    this.saveUserProfile();
  }

  /**
   * 獲取用戶進度
   */
  getUserProgress(): UserTutorialProfile {
    return { ...this.userProfile };
  }

  /**
   * 更新用戶偏好
   */
  updatePreferences(preferences: Partial<UserTutorialProfile['preferences']>): void {
    this.userProfile.preferences = {
      ...this.userProfile.preferences,
      ...preferences
    };
    this.saveUserProfile();
  }

  /**
   * 重置用戶進度
   */
  resetProgress(): void {
    this.userProfile = {
      completedTutorials: [],
      inProgressTutorials: {},
      preferences: this.userProfile.preferences, // 保留偏好設定
      skillLevel: {
        salary: 0,
        tax: 0,
        mortgage: 0,
        capital: 0,
        general: 0
      }
    };
    this.saveUserProfile();
  }

  /**
   * 獲取統計信息
   */
  getStats() {
    const totalTutorials = this.tutorials.size;
    const completedCount = this.userProfile.completedTutorials.length;
    const inProgressCount = Object.keys(this.userProfile.inProgressTutorials).length;
    
    const totalTimeSpent = Object.values(this.userProfile.inProgressTutorials)
      .reduce((sum, progress) => sum + progress.timeSpent, 0);

    const averageSkillLevel = Object.values(this.userProfile.skillLevel)
      .reduce((sum, level) => sum + level, 0) / Object.keys(this.userProfile.skillLevel).length;

    return {
      totalTutorials,
      completedCount,
      inProgressCount,
      completionRate: totalTutorials > 0 ? (completedCount / totalTutorials) * 100 : 0,
      totalTimeSpent: Math.round(totalTimeSpent / 60), // 轉換為分鐘
      averageSkillLevel: Math.round(averageSkillLevel)
    };
  }
}

// 創建全域實例
export const tutorialManager = new TutorialManager();