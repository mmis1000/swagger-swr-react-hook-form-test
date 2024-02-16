import { useMemo, useState } from "react"
import { apis } from "../api/useSwr"
import PostCreatePopup from "../components/PostCreatePopup"
import PostViewPopup from "../components/PostViewEdit"
import { PatchPostRequest, PostSimple } from "../api/api"
import { Button, Space, Table, TableProps } from "antd"
import { ColumnsType } from "antd/es/table"

const Posts = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { data, mutate, isLoading, isValidating } = apis.apis.use_postList({ current: page, pageSize })

  const removePost = async (id: number) => {
    await apis.apis.postDelete(id)
    // remove post from local, swr will reload it for latest data later
    setCreateVisible(false)
    mutate({ ...data!, data: data!.data.filter(i => i.id !== id) })
  }

  const onPostAdd = () => {
    setCreateVisible(false)
    // call mutate without args revalidate the data without change screen
    mutate()
  }
  const onPostEdit = (id: number, newContent: PatchPostRequest) => {
    setViewingPost(null)
    // call mutate without args revalidate the data without change screen
    mutate({ ...data!, data: data!.data.map(i => i.id !== id ? i : { ...i, ...newContent }) })
  }

  const [createVisible, setCreateVisible] = useState(false)
  const [viewingPost, setViewingPost] = useState<number | null>(null)

  const columns: ColumnsType<PostSimple> = [
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'editor',
      dataIndex: 'editor',
      key: 'editor',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        return <Space>
          <Button onClick={() => removePost(record.id)}>Delete</Button>
          <Button onClick={() => setViewingPost(record.id)}>Edit</Button>
        </Space>
      },
    },
  ];

  const handleTableChange: TableProps['onChange'] = (pagination) => {
    setPageSize(pagination.pageSize ?? pageSize)
    if (pagination.pageSize && pagination.pageSize !== pageSize) {
      setPage(1)
    } else {
      setPage(pagination.current ?? page)
    }
  };

  const tableParams = useMemo(() => data ? ({
    pagination: {
      current: data.page.current,
      pageSize: data.page.size,
      total: data.page.total
    },
  }) : {
    pagination: {
      current: 1,
      pageSize: pageSize,
      total: 0
    }
  }, [data, pageSize])

  return <>
    <Button onClick={() => (setCreateVisible(true))}>Add post</Button>
    <Table
      dataSource={data?.data}
      columns={columns}
      rowKey={(i) => i.id}
      pagination={tableParams.pagination}
      loading={isLoading || isValidating}

      onChange={handleTableChange}
    />
    {createVisible && <PostCreatePopup onClose={() => setCreateVisible(false)} onPostAdd={onPostAdd} />}
    {viewingPost != null && <PostViewPopup id={viewingPost} onClose={() => setViewingPost(null)} onPostEdit={onPostEdit} />}
  </>
}

export default Posts
