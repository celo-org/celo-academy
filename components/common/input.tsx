type Props = {
  value: string;
  onChange: (e: string) => void;
  placeholder?: string;
  className?: string;
};

function InputField({ value, onChange, placeholder, className }: Props) {
  return (
    <>
      <label className="font-noto">{placeholder}</label>
      <input
        type="text"
        className={
          className +
          " bg-white border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-3 font-noto"
        }
        required
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </>
  );
}

export default InputField;
