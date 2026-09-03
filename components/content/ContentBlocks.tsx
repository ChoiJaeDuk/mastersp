import type { ContentBlock } from '@/lib/content/types';

/**
 * 콘텐츠 블록 렌더러
 *
 * 원본 제품소개의 문단(.dec--03) / 불릿(.bullet-bx) / 표(.table-list) 마크업을 그대로 그린다.
 * 문단 안의 줄바꿈은 원본 <br> 이므로 whitespace-pre-line 으로 살린다.
 */
export default function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'p') {
          return (
            // 원본은 두 번째 문단부터 mt-5 mt-lg-10 을 준다.
            <p
              key={index}
              className={`dec--03 whitespace-pre-line${index > 0 ? ' mt-5 lg:mt-10' : ''}`}
            >
              {block.text}
            </p>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={index} className="bullet-bx bullet-list bullet-list--disc">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="dec--03 item">
                  <span className="whitespace-pre-line">{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <table key={index} className="table-list mt-7 lg:mt-13">
            {block.head.length > 0 && (
              <thead>
                <tr>
                  {block.head.map((cell, cellIndex) => (
                    <th
                      key={cellIndex}
                      scope="col"
                      className={`dec--04 font-weight-medium ${
                        cellIndex === 0 ? 'bd-right' : 'bd-left'
                      }`}
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
                      className={`dec--04 ${cellIndex === 0 ? 'font-weight-normal' : 'text--03'}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      })}
    </>
  );
}
