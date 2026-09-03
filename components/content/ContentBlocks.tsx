import type { ContentBlock } from '@/lib/content/types';

/**
 * 콘텐츠 블록 렌더러 (Server Component)
 *
 * 레거시 마크업의 문단 / 불릿 / 표를 동일한 순서로 그린다.
 * 문단 안의 줄바꿈은 원본 <br> 이므로 whitespace-pre-line 으로 살린다.
 */
export default function ContentBlocks({
  blocks,
  className = '',
}: {
  blocks: ContentBlock[];
  className?: string;
}) {
  if (blocks.length === 0) return null;

  return (
    <div className={`space-y-5 lg:space-y-8 ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === 'p') {
          return (
            <p key={index} className="t-dec-03 whitespace-pre-line text-shell">
              {block.text}
            </p>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={index} className="space-y-3">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="relative pl-4">
                  <span
                    aria-hidden
                    className="absolute top-[0.7em] left-0 size-1.5 rounded-full bg-brand"
                  />
                  <span className="t-dec-03 whitespace-pre-line text-shell">{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <div key={index} className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse border-t-2 border-ink text-left">
              {block.head.length > 0 && (
                <thead>
                  <tr className="bg-[#f7f7f7]">
                    {block.head.map((cell, cellIndex) => (
                      <th
                        key={cellIndex}
                        scope="col"
                        className="border-b border-[#ddd] px-5 py-3.5 text-[0.9375rem] font-semibold text-ink"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`border-b border-[#eee] px-5 py-3.5 text-[0.9375rem] whitespace-pre-line ${
                          cellIndex === 0 ? 'font-medium text-ink' : 'text-shell'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
