export default function Icons() {
  const loading = (
    <svg className="w-12 h-12 fill-neutral-400 loading" viewBox="0 0 24 24">
      <path fill="inherit" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
    </svg>
  );
  const download = (
    <svg className="w-6 h-6 fill-inherit" viewBox="0 0 24 24">
      <path
        fill="inherit"
        d="M2 12H4V17H20V12H22V17C22 18.11 21.11 19 20 19H4C2.9 19 2 18.11 2 17V12M12 15L17.55 9.54L16.13 8.13L13 11.25V2H11V11.25L7.88 8.13L6.46 9.55L12 15Z"
      />
    </svg>
  );
  const deleteFile = (
    <svg className="w-6 h-6 fill-inherit" viewBox="0 0 24 24">
      <path
        fill="inherit"
        d="M22.54 21.12L20.41 19L22.54 16.88L21.12 15.46L19 17.59L16.88 15.46L15.46 16.88L17.59 19L15.46 21.12L16.88 22.54L19 20.41L21.12 22.54M6 2C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H13.81C13.45 21.38 13.2 20.7 13.08 20H6V4H13V9H18V13.08C18.33 13.03 18.67 13 19 13C19.34 13 19.67 13.03 20 13.08V8L14 2M8 12V14H16V12M8 16V18H13V16Z"
      />
    </svg>
  );
  return { loading, download, deleteFile };
}
