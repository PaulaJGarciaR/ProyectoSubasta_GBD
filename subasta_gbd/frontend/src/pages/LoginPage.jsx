function LoginPage() {
  return (
    <div className="bg-[#1F3B4D] h-screen">
      <div className="flex justify-center items-center pt-[12%]">
        <div className=" w-[50%]">
          <div className="flex justify-center w-[100%]">
            <div className="w-[55%] bg-white rounded-l-2xl">
              <div className="text-center mt-8">
                <h1 className="text-2xl font-semibold">Bienvenidos a</h1>
                <h2 className="text-4xl font-bold">Subastas.com</h2>
              </div>

              <form className=" w-[100%]" action="">
                <div className="flex justify-center">
                  <div className="w-[80%]">
                    <input
                      type="email"
                      placeholder="email"
                      class="mt-10 p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                    />
                    <input
                      id="password"
                      formControlName="password"
                      type="password"
                      placeholder="Contraseña"
                      class="mt-10 p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-8">
                    <a className="font-semibold text-[#F47C3C]" href="">¿Olvidaste tu contraseña?</a>
                </div>
                
                <div className="flex justify-center items-center m-8">
                    <button className="bg-[#F47C3C] px-6 py-3 rounded-xl font-semibold text-white">Ingresar</button>
                </div>
              </form>
            </div>
            <div className=" w-[45%] bg-[#F9A26C]">ñ</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
