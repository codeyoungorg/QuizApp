import {
  createGKQuiz,
  getGKQuestions,
  selectRandomTopicOfCategory,
} from "@/actions/gk-quiz";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookAIcon,
  DicesIcon,
  FerrisWheelIcon,
  Globe2,
  HazeIcon,
  TreesIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GKCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  grade: number;
  userId: string;
}

const getIcon = (category: string) => {
  if (category === "Learning and Education") {
    return <BookAIcon />;
  } else if (category === "Everyday Life") {
    return <TreesIcon />;
  } else if (category === "Fun and Entertainment") {
    return <FerrisWheelIcon />;
  } else if (category === "Culture and Heritage") {
    return <HazeIcon />;
  } else if (category === "Geography and Nature") {
    return <Globe2 />;
  } else {
    return <BookAIcon />;
  }
};

const GKCategoryDialog = ({
  isOpen,
  onClose,
  categories,
  grade,
  userId,
}: GKCategoryDialogProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCategorySelect = async () => {
    setIsLoading(true);
    try {
      const { topicId } = await selectRandomTopicOfCategory({
        category: selectedCategory!,
        grade,
      });
      if (topicId) {
        await generateGKQuiz(topicId);
        setSelectedCategory(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  const generateGKQuiz = async (topicId: number) => {
    try {
      const { questions } = await getGKQuestions({ userId, topicId });
      if (questions?.length === 0) {
        return;
      }
      // create gk quiz and redirect to gk-quiz page
      const data = await createGKQuiz({ userId, questions, topicId });
      if (!data || !data!.length) return;
      router.push(`/gk-quiz/${data[0]?.id}`);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleRandomSelect = () => {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    setSelectedCategory(randomCategory);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full z-[150] p-4 py-6 !rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Choose a Category
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
          {categories.map((category) => (
            <div
              key={category}
              className={`transition-all hover:shadow-lg ${
                selectedCategory === category
                  ? "bg-orange-200"
                  : "bg-orange-100"
              } rounded-xl grid place-content-center p-4 cursor-pointer gap-2`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="mx-auto">{getIcon(category)}</div>
              <h3 className="text-sm font-semibold text-gray-700 text-center">
                {category.split("and")[0]}
              </h3>
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center gap-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="h-[1px] bg-gray-200 w-full"></div>
          ))}
        </div>
        {selectedCategory ? (
          <button
            onClick={handleCategorySelect}
            className="transition-all hover:shadow-lg bg-orange-500 text-white rounded-xl flex items-center p-6 py-4 cursor-pointer gap-2 mx-auto"
          >
            <span className="text-sm font-semibold text-center">
              {isLoading ? "Loading..." : "Continue"}
            </span>
          </button>
        ) : (
          <button
            onClick={handleRandomSelect}
            className="transition-all hover:shadow-lg bg-orange-100 rounded-xl flex items-center p-6 py-4 cursor-pointer gap-2 mx-auto"
          >
            <span className="text-sm font-semibold text-gray-700 text-center">
              Select Random
            </span>
            <DicesIcon />
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GKCategoryDialog;
