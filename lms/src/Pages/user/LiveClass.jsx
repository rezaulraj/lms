import Sidebar from "../../components/Sidebar";
import DownloadAppBanner from "../../components/DownloadAppBanner ";
import HelpSection from "../../components/HelpSection";

export default function LiveClass() {
  return (
    <Sidebar>
      <div className="md:px-16 px-2 m-auto flex flex-col gap-10">
        <DownloadAppBanner />
        <HelpSection />
      </div>
    </Sidebar>
  );
}
