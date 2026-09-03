import Reveal from '@/components/ui/Reveal';

/** 원본 .section--together (Server Component) */
export default function TogetherSection() {
  return (
    <section className="mt-20 lg:mt-40">
      <div className="bg-[url('/images/main/together-bg.jpg')] bg-cover bg-center bg-no-repeat text-center text-white">
        <div className="site-container">
          <div className="py-20 font-display font-black md:py-40 lg:py-50 xxl:py-[17.5rem]">
            <Reveal>
              <p className="t-together leading-none">
                <span className="tri-deco">Together,</span>
              </p>
            </Reveal>
            <Reveal>
              <p className="t-together-sub mt-5 leading-none lg:mt-10">
                We build a sustainable future.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      <Reveal className="my-20 text-center lg:my-[9.375rem] xxl:mb-[11.875rem]">
        <div className="site-container">
          <p className="t-title-md font-normal">
            장인의공간은 국내 전력시장과 IT 산업의 혁신을 주도하며, 미래 지향적인 솔루션을 통해
            <br className="hidden xxl:block" />
            지속 가능한 성장을 이루어갑니다.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
