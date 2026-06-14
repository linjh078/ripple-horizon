import { MapPin, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <MapPin className="size-6 text-orange-600" />
          线下空间
        </h1>
        <p className="text-muted-foreground">
          校园自由空间——沙龙、公开分享、线下活动。在这里发布时间、地点与活动信息。
        </p>
      </div>

      {/* 功能预告卡片 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="size-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">发布活动</h3>
            <p className="text-sm text-muted-foreground">
              填写活动主题、时间、地点，邀请大家参与
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="size-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">沙龙 & 分享会</h3>
            <p className="text-sm text-muted-foreground">
              组织小型沙龙、经验分享会，面对面交流
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <MapPin className="size-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">自由空间</h3>
            <p className="text-sm text-muted-foreground">
              校园内的自由角落，随时发起一场线下聚会
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 活动列表区 */}
      <div className="rounded-xl border bg-card p-12 text-center">
        <MapPin className="size-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">还没有线下活动</h3>
        <p className="text-muted-foreground mb-4">
          成为第一个发起线下活动的人吧！
          <br />
          沙龙、分享会、学习小组——在这里发布，让更多人参与。
        </p>
        <p className="text-xs text-muted-foreground">
          活动发布功能即将上线，敬请期待
        </p>
      </div>
    </div>
  );
}
