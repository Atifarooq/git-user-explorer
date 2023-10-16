import { FC } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Link,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Stats from "../../components/Stats";
import { IUserStat } from "../../types/user.type";

const ItemBox: FC<any> = ({ loading, user, secondaryAction }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: matches ? "column" : "row",
        alignItems: "center",
        gap: 2,
        p: 2,
      }}
    >
      {loading ? (
        <Skeleton
          sx={{ width: 150, height: 150 }}
          animation="wave"
          variant="rectangular"
        />
      ) : (
        <CardMedia
          component="img"
          sx={{ width: 150 }}
          image={user?.avatar_url}
          alt="User Avatar"
        />
      )}
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
      >
        <CardHeader
          action={!loading && secondaryAction}
          title={
            loading ? <Skeleton animation="wave" height={32} /> : user?.name
          }
          subheader={
            loading ? (
              <>
                <Skeleton animation="wave" height={20} width="40%" />
                <Skeleton animation="wave" height={20} width="80%" />
              </>
            ) : (
              <>
                <Link href={user?.html_url} underline="none">
                  @{user?.login}
                </Link>
                <br />
                {user?.bio}
              </>
            )
          }
          sx={{ py: 0 }}
        />
        <CardContent sx={{ pb: "0 !important" }}>
          {loading ? (
            <>
              <Skeleton animation="wave" height={32} />
              <Skeleton animation="wave" height={20} />
            </>
          ) : (
            <Box sx={{ display: "flex", gap: "28px" }}>
              {user?.stats &&
                user?.stats?.map(({ caption, value }: IUserStat) => (
                  <Stats key={Math.random()} caption={caption} value={value} />
                ))}
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default ItemBox;
