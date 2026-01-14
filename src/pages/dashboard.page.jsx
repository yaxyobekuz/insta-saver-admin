// Router
import { Link } from "react-router-dom";

// Components
import CardComponent from "@/components/ui/card.component";

// Icons
import { Users, MessageCircle, ChartBar } from "lucide-react";

const DashboardPage = () => {
  return (
    <div>
      {/* Welcome Section */}
      <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
        Xush kelibsiz, Admin!
      </h2>

      {/* Quick Actions */}
      <CardComponent className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tezkor harakatlar
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Users */}
          <Link
            to="/users"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="size-6 text-indigo-600 mr-3" strokeWidth={1.5} />
            <div>
              <p className="font-medium text-gray-900">Foydalanuvchilar</p>
              <p className="text-sm text-gray-500">Boshqarish</p>
            </div>
          </Link>

          {/* Xabarlar */}
          <Link
            to="/messages"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageCircle
              className="size-6 text-indigo-600 mr-3"
              strokeWidth={1.5}
            />
            <div>
              <p className="font-medium text-gray-900">Xabarlar</p>
              <p className="text-sm text-gray-500">Boshqarish</p>
            </div>
          </Link>

          {/* Statistika */}
          <Link
            to="/stats"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChartBar
              className="size-6 text-indigo-600 mr-3"
              strokeWidth={1.5}
            />
            <div>
              <p className="font-medium text-gray-900">Statistika</p>
              <p className="text-sm text-gray-500">Ko'rish</p>
            </div>
          </Link>
        </div>
      </CardComponent>
    </div>
  );
};

export default DashboardPage;
