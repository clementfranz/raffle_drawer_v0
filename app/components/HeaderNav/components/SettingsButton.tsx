interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton = ({ onClick }: SettingsButtonProps) => {
  return (
    <div className="settings-button w-full">
      <button
        onClick={onClick}
        className="px-4 py-2 hover:bg-[#7d0b1c] rounded-full cursor-pointer w-full"
      >
        Settings
      </button>
    </div>
  );
};

export default SettingsButton;
