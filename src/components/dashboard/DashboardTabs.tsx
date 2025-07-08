
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTab } from "./PostsTab";
import { SocialAccountsTab } from "./SocialAccountsTab";
import { TemplatesTab } from "./TemplatesTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { ProfileTab } from "./ProfileTab";

export const DashboardTabs = () => {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="social">Contas</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="profile">Perfil</TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts" className="mt-6">
        <PostsTab />
      </TabsContent>
      
      <TabsContent value="social" className="mt-6">
        <SocialAccountsTab />
      </TabsContent>
      
      <TabsContent value="templates" className="mt-6">
        <TemplatesTab />
      </TabsContent>
      
      <TabsContent value="analytics" className="mt-6">
        <AnalyticsTab />
      </TabsContent>
      
      <TabsContent value="profile" className="mt-6">
        <ProfileTab />
      </TabsContent>
    </Tabs>
  );
};
