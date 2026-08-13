import React, { useEffect, useState } from "react";

type Article = {
  article_id?: string | number;
  title?: string;
  [key: string]: any;
};

export default function ApiFetch(): JSX.Element {
  const [users, setUsers] = useState<Article[]>([]);

  const result = async () => {
    try {
      const response = await fetch(
        "https://newsdata.io/api/1/latest?apikey=pub_8f9114ea19ec4fbb97a2231baa35a8fb"
      );

      const data = await response.json();

      console.log(data.results);

      setUsers(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.log(error);
      setUsers([]);
    }
  };

  useEffect(() => {
    result();
  }, []);

  return (
    <>
      {users.map((user, i) => (
        <div key={user.article_id ?? i}>
          <h3>{user.title ?? 'No title'}</h3>
        </div>
      ))}
    </>
  );
}