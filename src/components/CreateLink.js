import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { FEED_QUERY } from './LinkList';

const CREATE_LINK_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

export const CreateLink = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    description: '',
    url: '',
  });

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url,
    },
    update: (cache, { data: { post } }) => {
      const data = cache.readQuery({
        query: FEED_QUERY,
      });
      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: [post, ...data.feed.links],
          },
        },
      });
    },
    onCompleted: () => navigate('/'),
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createLink();
          setFormState({ description: '', url: '' });
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.description}
            onChange={(e) =>
              setFormState({ ...formState, description: e.target.value })
            }
            type="text"
            placeholder="A description for the link"
          />
          <input
            type="text"
            className="mb2"
            value={formState.url}
            placeholder="The URL for the link"
            onChange={(e) =>
              setFormState({
                ...formState,
                url: e.target.value,
              })
            }
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
